import { withBasePath } from "@/utils/urlHelper";
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
    return (
        <Link href="/">
            <h1 className='text-4xl font-semibold text-midnight_text'>RIMCore</h1>
        </Link>
    );
};

export default Logo;
