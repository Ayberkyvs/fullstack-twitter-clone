import { MdVerified } from "react-icons/md";

const findBadge = (badgeName: string) => {
    switch (badgeName) {
        case "admin":
            return <MdVerified className="fill-primary w-[1.1em] h-[1.1em] place-self-center"/>;
        case "moderator":
            return "🛡️";
        case "contributor":
            return "🌟";
        default:
            return null;
    }
}

export default findBadge;