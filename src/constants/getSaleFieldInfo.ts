export default function getSaleFieldInfo(field: string) {

    if (field == "price") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/launch`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=recipient&from=price`;
        const placeholder = "enter a price in USD";
        const title = "price your token";
        const subtitle = "choose an initial price for your token";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "recipient") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=price&from=recipient`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=saleMax&from=recipient`;
        const placeholder = "enter a base-compatible address";
        const title = "who gets sale proceeds?";
        const subtitle = "probably your wallet address...";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "saleMax") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=recipient&from=saleMax`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=userMax&from=saleMax`;
        const placeholder = "enter the amount in USD";
        const title = "max. sale amount";
        const subtitle = "cannot exceed your total supply times your price";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "userMax") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=saleMax&from=userMax`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=purchaseMin&from=userMax`;
        const placeholder = "enter the amount in USD";
        const title = "max. amount per user";
        const subtitle = "cannot exceed your total supply times your price";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "purchaseMin") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=userMax&from=purchaseMin`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=openIn&from=purchaseMin`;
        const placeholder = "enter the amount in USD";
        const title = "min. purchase amount";
        const subtitle = "leave blank for no minimum";
        return { prevURL, nextURL, placeholder, title, subtitle };
    }
    else if (field == "openIn") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=purchaseMin&from=openIn`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=duration&from=openIn`;
        const placeholder = "leave blank for immediate sale";
        const title = "set sale open time";
        const subtitle = "choose a number of hours from now";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "duration") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=openIn&from=duration`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=maxQueue&from=duration`;
        const placeholder = "enter a number of hours";
        const title = "how long is the sale?";
        const subtitle = "choose a total duration in hours";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "maxQueue") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=duration&from=maxQueue`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=infoURL&from=maxQueue`;
        const placeholder = "leave blank for no limit";
        const title = "max. queue time";
        const subtitle = "choose a max queue per user time in hours";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "infoURL") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=maxQueue&from=infoURL`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/salePreview?from=infoURL`;
        const placeholder = "leave blank for no link";
        const title = "is there more?";
        const subtitle = "enter a URL with more information";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else {
        return { prevURL: "", nextURL: "", nextPrevURL: "", nextNextURL: "", placeholder: "", nextPlaceholder: "", title: "", subtitle: "" };
    }
}