import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { children, headerNode, infoNode, kcContext, displayMessage = true } = props;

    // Minimal template that renders page content without Keycloak chrome
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {headerNode && <div className="mb-6">{headerNode}</div>}
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    {/* Display global messages (success, error, warning, info) */}
                    {displayMessage && kcContext.message !== undefined && (
                        <div
                            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                                kcContext.message.type === "success"
                                    ? "bg-green-50 border border-green-200"
                                    : kcContext.message.type === "error"
                                      ? "bg-red-50 border border-red-200"
                                      : kcContext.message.type === "warning"
                                        ? "bg-yellow-50 border border-yellow-200"
                                        : "bg-blue-50 border border-blue-200"
                            }`}
                        >
                            {kcContext.message.type === "success" && (
                                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            {kcContext.message.type === "error" && (
                                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            {kcContext.message.type === "warning" && (
                                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            {kcContext.message.type === "info" && (
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            <span
                                className={`text-sm ${
                                    kcContext.message.type === "success"
                                        ? "text-green-800"
                                        : kcContext.message.type === "error"
                                          ? "text-red-800"
                                          : kcContext.message.type === "warning"
                                            ? "text-yellow-800"
                                            : "text-blue-800"
                                }`}
                                dangerouslySetInnerHTML={{ __html: kcSanitize(kcContext.message.summary) }}
                            />
                        </div>
                    )}
                    {children}
                </div>
                {infoNode && <div className="mt-6">{infoNode}</div>}
            </div>
        </div>
    );
}
