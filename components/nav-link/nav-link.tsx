import Link from "next/link";

const NavLink = ({path, icon, label}) => {
    return (
        <Link href={path} className="flex text-lg md:text-lg font-semibold items-center normal-case ml-5 mb-2 lg:mb-0">
            {icon}
            <span className='ml-2'>
                {label}
            </span>
        </Link>
    )
};

export default NavLink;