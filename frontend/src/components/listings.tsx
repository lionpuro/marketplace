import { formatPrice, localDate } from "#/helpers";
import { Link } from "@tanstack/react-router";
import type { Listing } from "backend";

export const Listings = ({ listings }: { listings?: Listing[] }) => (
	<ul className="flex flex-col gap-4">
		{listings?.map((listing) => (
			<li key={listing.id}>
				<Link
					to="/listings/$id"
					params={{ id: listing.id.toString() }}
					className="flex flex-wrap"
				>
					<h3 className="grow font-medium hover:underline">{listing.title}</h3>
					<time className="ml-auto text-neutral-500 text-sm flex items-center">
						{localDate(listing.created_at)}
					</time>
					<span className="font-medium text-xl w-full">
						{formatPrice(listing.price)}
					</span>
				</Link>
			</li>
		))}
	</ul>
);
