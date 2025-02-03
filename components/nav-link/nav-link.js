import Link from "next/link";

const NavLink = ({path, icon, label}) => {
    return (
        <Link href={path} className="flex text-lg md:text-lg font-semibold items-center btn btn-ghost normal-case">
            {icon}
            <span className='ml-2'>
                {label}
            </span>
        </Link>
    )
};

export default NavLink;