import { useState, useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import logo from "../assets/img/log.avif";

export default function Password(props: PageProps<Extract<KcContext, { pageId: "password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, password, account, stateChecker, messagesPerField } = kcContext;

    const { msgStr, msg } = i18n;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [newPasswordConfirmError, setNewPasswordConfirmError] = useState("");
    const [hasNewPasswordBlurred, setHasNewPasswordBlurred] = useState(false);
    const [hasNewPasswordConfirmBlurred, setHasNewPasswordConfirmBlurred] = useState(false);

    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validate passwords
    useEffect(() => {
        if (!hasNewPasswordBlurred) {
            return;
        }

        if (newPassword === "") {
            setNewPasswordError(msgStr("missingPasswordMessage"));
            return;
        }

        setNewPasswordError("");
    }, [newPassword, hasNewPasswordBlurred, msgStr]);

    useEffect(() => {
        if (!hasNewPasswordConfirmBlurred) {
            return;
        }

        if (newPasswordConfirm === "") {
            setNewPasswordConfirmError(msgStr("passwordConfirmNotMatch"));
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            setNewPasswordConfirmError(msgStr("invalidPasswordConfirmMessage"));
            return;
        }

        setNewPasswordConfirmError("");
    }, [newPassword, newPasswordConfirm, hasNewPasswordConfirmBlurred, msgStr]);

    // Compute overall message for template
    const getTemplateMessage = () => {
        if (newPasswordError !== "") {
            return { type: "error" as const, summary: newPasswordError };
        }
        if (newPasswordConfirmError !== "") {
            return { type: "error" as const, summary: newPasswordConfirmError };
        }
        return kcContext.message;
    };

    const templateMessage = getTemplateMessage();

    return (
        <Template
            {...{
                kcContext: { ...kcContext, message: templateMessage },
                i18n,
                doUseDefaultCss,
                classes
            }}
            active="password"
        >
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <img src={logo} alt="Logo" className="h-8 w-auto" />
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        {/* Header */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{msg("changePasswordHtmlTitle")}</h2>

                        {/* Success/Error Message */}
                        {templateMessage && templateMessage.type === "success" && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-green-800" dangerouslySetInnerHTML={{ __html: kcSanitize(templateMessage.summary) }} />
                            </div>
                        )}

                        {templateMessage && templateMessage.type === "error" && !newPasswordError && !newPasswordConfirmError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-red-800" dangerouslySetInnerHTML={{ __html: kcSanitize(templateMessage.summary) }} />
                            </div>
                        )}

                        <form action={url.passwordUrl} className="space-y-5" method="post">
                            {/* Hidden fields for autocomplete */}
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={account.username ?? ""}
                                autoComplete="username"
                                readOnly
                                className="hidden"
                            />
                            <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />

                            {/* Current Password - Only show if password is set */}
                            {password.passwordSet && (
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                                        {msg("password")}
                                        <span className="text-red-600 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            autoComplete="current-password"
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            aria-invalid={messagesPerField.existsError("password")}
                                            aria-describedby={messagesPerField.existsError("password") ? "input-error-password" : undefined}
                                            className={clsx(
                                                "w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200",
                                                "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                                messagesPerField.existsError("password")
                                                    ? "border-red-600 bg-red-50"
                                                    : "border-gray-300 hover:border-gray-400"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                        >
                                            {showCurrentPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {messagesPerField.existsError("password") && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span
                                                id="input-error-password"
                                                className="text-sm text-red-600"
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("password")) }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* New Password */}
                            <div>
                                <label htmlFor="password-new" className="block text-sm font-medium text-gray-900 mb-2">
                                    {msg("passwordNew")}
                                    <span className="text-red-600 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="password-new"
                                        name="password-new"
                                        autoComplete="new-password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        onBlur={() => setHasNewPasswordBlurred(true)}
                                        aria-invalid={messagesPerField.existsError("password-new") || !!newPasswordError}
                                        aria-describedby={
                                            messagesPerField.existsError("password-new")
                                                ? "input-error-password-new"
                                                : newPasswordError
                                                  ? "input-error-password-new-client"
                                                  : undefined
                                        }
                                        className={clsx(
                                            "w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200",
                                            "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                            newPasswordError || messagesPerField.existsError("password-new")
                                                ? "border-red-600 bg-red-50"
                                                : "border-gray-300 hover:border-gray-400"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {messagesPerField.existsError("password-new") && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            id="input-error-password-new"
                                            className="text-sm text-red-600"
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("password-new")) }}
                                        />
                                    </div>
                                )}
                                {newPasswordError && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span id="input-error-password-new-client" className="text-sm text-red-600">
                                            {newPasswordError}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-900 mb-2">
                                    {msg("passwordConfirm")}
                                    <span className="text-red-600 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="password-confirm"
                                        name="password-confirm"
                                        autoComplete="new-password"
                                        value={newPasswordConfirm}
                                        onChange={e => setNewPasswordConfirm(e.target.value)}
                                        onBlur={() => setHasNewPasswordConfirmBlurred(true)}
                                        aria-invalid={messagesPerField.existsError("password-confirm") || !!newPasswordConfirmError}
                                        aria-describedby={
                                            messagesPerField.existsError("password-confirm")
                                                ? "input-error-password-confirm"
                                                : newPasswordConfirmError
                                                  ? "input-error-password-confirm-client"
                                                  : undefined
                                        }
                                        className={clsx(
                                            "w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200",
                                            "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                            newPasswordConfirmError || messagesPerField.existsError("password-confirm")
                                                ? "border-red-600 bg-red-50"
                                                : "border-gray-300 hover:border-gray-400"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {messagesPerField.existsError("password-confirm") && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            id="input-error-password-confirm"
                                            className="text-sm text-red-600"
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("password-confirm")) }}
                                        />
                                    </div>
                                )}
                                {newPasswordConfirmError && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span id="input-error-password-confirm-client" className="text-sm text-red-600">
                                            {newPasswordConfirmError}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={
                                    !!(
                                        newPasswordError ||
                                        newPasswordConfirmError ||
                                        !newPassword ||
                                        !newPasswordConfirm ||
                                        (password.passwordSet && !currentPassword)
                                    )
                                }
                                className="w-full px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {msgStr("doSave")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Template>
    );
}
