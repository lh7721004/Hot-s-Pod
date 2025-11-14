// KakaoMap.jsx
import { useEffect, useRef } from "react";

export default function KakaoMap({ onSelect }) {
  const containerRef = useRef(null);
  const onSelectRef = useRef(onSelect);

  // 최신 onSelect만 ref에 갱신 (리렌더될 때 effect 다시 돌지 않게)
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const initMap = () => {
      if (!window.kakao || !containerRef.current) return;
      const { kakao } = window;

      kakao.maps.load(() => {
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 최초 중심(서울)
          level: 3,
        });

        map.setDraggable(true);
        map.setZoomable(true);

        const geocoder = new kakao.maps.services.Geocoder();
        const marker = new kakao.maps.Marker({ map: null });

        kakao.maps.event.addListener(map, "click", function (mouseEvent) {
          const latlng = mouseEvent.latLng;

          marker.setPosition(latlng);
          marker.setMap(map);

          const lat = latlng.getLat();
          const lng = latlng.getLng();

          geocoder.coord2Address(lng, lat, (result, status) => {
            if (!onSelectRef.current) return;

            if (status === kakao.maps.services.Status.OK) {
              const road = result[0].road_address?.address_name || "";
              const jibun = result[0].address?.address_name || "";
              const address = road || jibun;

              onSelectRef.current({ lat, lng, address });
            } else {
              onSelectRef.current({ lat, lng, address: "" });
            }
          });
        });
      });
    };

    // 이미 kakao가 로드돼 있으면 바로 초기화
    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      // 아직이면 script load 기다렸다가 실행
      const script = document.querySelector(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );
      if (!script) return;

      const onLoad = () => initMap();
      script.addEventListener("load", onLoad);

      return () => {
        script.removeEventListener("load", onLoad);
      };
    }
  }, []);

  // 터치 디바이스에서만 touchAction 적용
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        ...(isTouchDevice ? { touchAction: "none" } : {}),
      }}
    />
  );
}
