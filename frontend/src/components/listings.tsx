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
					<h3 className="grow font-semibold hover:underline text-neutral-900">
						{listing.title}
					</h3>
					<span className="font-semibold text-2xl w-full text-neutral-900">
						{formatPrice(listing.price)}
					</span>
					<span className="text-neutral-900">
						{`${listing.location.country_emoji ?? ""} ${listing.location.country ?? ""}`}
					</span>
					<time className="ml-auto text-neutral-500 text-sm flex items-center">
						{localDate(listing.created_at)}
					</time>
				</Link>
			</li>
		))}
	</ul>
);
