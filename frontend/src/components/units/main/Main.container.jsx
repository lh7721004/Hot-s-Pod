import MainUI from "./Main.presenter.jsx";

export default function Main() {
    let announcements = [
        {title: '공지1', content: '공지내용 1 공지내용 1 공지내용 1 공지내용 1공지내용  1 공지내용 1공지내용 1 공지내용 1  공지내용 1공지내용 1공지내용 1공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'}
    ]

    let clubs = [
        {title: '팟1', content: 'IT 개발 팟', date: '2025-01-12'},
        {title: '팟2', content: '음악 팟', date: '2025-01-12'},
        {title: '팟3', content: '봉사 팟', date: '2025-01-12'}
    ]

    return <MainUI announcements={announcements} clubs={clubs}/>
}