"use client";

import { createElement } from "react";
import Script from "next/script";

/**
 * Embeds a Donorbox donation form.
 *
 * `widgets.js` registers the `<dbox-widget>` custom element and replaces it
 * with the campaign's donation form. The element is created via
 * `createElement` so TypeScript doesn't need a JSX intrinsic declaration.
 */
export default function DonorboxWidget({
  campaign,
}: {
  campaign: string;
}) {
  return (
    <>
      <Script
        src="https://donorbox.org/widgets.js"
        type="module"
        strategy="afterInteractive"
      />
      {createElement("dbox-widget", {
        campaign,
        type: "donation_form",
        "enable-auto-scroll": "true",
      })}
    </>
  );
}
