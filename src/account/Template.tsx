import type { TemplateProps } from "keycloakify/account/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { children } = props;

    // Minimal template that only renders the page content without Keycloak chrome
    return <>{children}</>;
}
