import { formatPrice, localDate } from "#/helpers";
import { Link } from "@tanstack/react-router";
import type { Listing } from "backend";
import { IconImage } from "./icons";

export const Listings = ({ listings }: { listings?: Listing[] }) => (
	<ul className="flex flex-col gap-4">
		{listings?.map((listing) => (
			<li key={listing.id}>
				<Link
					to="/listings/$id"
					params={{ id: listing.id.toString() }}
					className="flex"
				>
					<div className="bg-neutral-200 text-neutral-400 flex justify-center items-center h-32 md:h-38 aspect-square mr-4">
						<IconImage size="32" />
					</div>
					<div className="flex flex-col w-full">
						<h3 className="font-semibold hover:underline text-base-900">
							{listing.title}
						</h3>
						<span className="font-semibold text-2xl w-full text-base-900">
							{formatPrice(listing.price)}
						</span>
						<div className="flex items-center mt-auto">
							<span className="text-base-900 self-end">
								{`${listing.location.country_emoji ?? ""} ${listing.location.country ?? ""}`}
							</span>
							<time className="ml-auto text-base-500 text-sm flex items-center self-end">
								{localDate(listing.created_at)}
							</time>
						</div>
					</div>
				</Link>
			</li>
		))}
	</ul>
);
