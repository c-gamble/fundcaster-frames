export default function getFieldInfo(field: string) {

    if (field == "name") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/frames/home`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=ticker&from=name`;
        const placeholder = "type your token's name here";
        const title = "name your token";
        const subtitle = "be creative—clever names often attract more attention";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "ticker") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=name&from=ticker`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=logo&from=ticker`;
        const placeholder = "enter the ticker here";
        const title = "what's the ticker?";
        const subtitle = "choose a unique ticker to stand out";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "logo") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=ticker&from=logo`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=gradientStart&from=logo`;
        const placeholder = "paste URL here (max. 100KB)";
        const title = "pick a logo";
        const subtitle = "or click 'Next' to use the default image";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "gradientStart") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=logo&from=gradientStart`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=gradientEnd&from=gradientStart`;
        const placeholder = "enter a hex color code";
        const title = "choose a primary color";
        const subtitle = "optionally add branding with a gradient";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "gradientEnd") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=gradientStart&from=gradientEnd`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=description&from=gradientEnd`;
        const placeholder = "enter a hex color code";
        const title = "choose a secondary color";
        const subtitle = "optionally add branding with a gradient";
        return { prevURL, nextURL, placeholder, title, subtitle };
    }
    else if (field == "description") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=gradientEnd&from=description`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=supply&from=description`;
        const placeholder = "type the description here";
        const title = "describe your token";
        const subtitle = "tell your holders what they're holding";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else if (field == "supply") {
        const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=description&from=supply`;
        const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/preview?from=supply`;
        const placeholder = "(max. 10 billion)";
        const title = "choose a total supply";
        const subtitle = "how many tokens will be minted?";
        return { prevURL, nextURL, placeholder, title, subtitle };
    } else {
        return { prevURL: "", nextURL: "", nextPrevURL: "", nextNextURL: "", placeholder: "", nextPlaceholder: "", title: "", subtitle: "" };
    }
}