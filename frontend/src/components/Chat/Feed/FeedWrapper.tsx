import { Session } from "next-auth";

interface FeedWrapperProps {
	session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
	return <>FW</>;
};

export default FeedWrapper;
