function AdminHeader() {

    return (
        <header className='lg:h-[50px] mt-2 lg:mt-1 lg:shadow-md sticky t-0 flex items-center mb-3 flex-col'>
            <div className='container flex items-center h-full justify-between pr-2 mx-auto mb-1'>
                <h1 className="mx-auto text-2xl font-bold text-gray-800">Admin Panel</h1>
            </div>
        </header>
    )
}

export default AdminHeader