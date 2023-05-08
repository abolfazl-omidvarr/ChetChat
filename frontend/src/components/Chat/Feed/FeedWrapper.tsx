"use client";
import { Session } from "next-auth";
import { useParams, useSearchParams } from "next/navigation";
import qs from "query-string";

interface FeedWrapperProps {
	session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
	const params = useSearchParams();
	const { conversationId } = qs.parse(params.toString());
	return <>FW</>;
};

export default FeedWrapper;
