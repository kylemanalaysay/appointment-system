

const Error = ({ errMessage }) => {
    return <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <h3 className="text-headingColor text-[20px] leading-[30px] font-semibold">{errMessage}</h3>
    </div>
}

export default Error
