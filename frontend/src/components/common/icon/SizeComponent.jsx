const SizeComponent = ({Component,className,fontSize}) => {
    return (<Component className={className} sx={{ fontSize: fontSize }} />)
}
export default SizeComponent;