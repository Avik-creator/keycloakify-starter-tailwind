import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";

interface FormAttribute {
    name?: string;
    displayName?: string;
    defaultValue?: string;
    readOnly?: boolean;
    required?: boolean;
    type?: string;
    autoComplete?: string;
}

export function UserProfileFormFieldsCustom(props: UserProfileFormFieldsProps) {
    const { kcContext, onIsFormSubmittableValueChange } = props;

    const { messagesPerField, formData } = kcContext;

    // Track form validity
    const handleFormChange = () => {
        const form = document.getElementById("kc-register-form") as HTMLFormElement;
        if (form) {
            const isValid = form.checkValidity();
            onIsFormSubmittableValueChange?.(isValid);
        }
    };

    return (
        <div className="space-y-5">
            {(kcContext.userProfileFormAttributes as FormAttribute[])?.map((attribute: FormAttribute, index: number) => {
                const fieldName = attribute.name ?? `field-${index}`;
                const fieldValue = (formData as Record<string, unknown>)?.[fieldName] ?? attribute.defaultValue ?? "";

                if (attribute.readOnly) {
                    return (
                        <div key={fieldName}>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                {attribute.displayName}
                                {attribute.required && <span className="text-red-600 ml-1">*</span>}
                            </label>
                            <input
                                type="text"
                                value={fieldValue as string}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                            />
                        </div>
                    );
                }

                const hasError = messagesPerField.existsError(fieldName);
                const errorMessage = messagesPerField.get(fieldName);

                return (
                    <div key={fieldName}>
                        <label htmlFor={fieldName} className="block text-sm font-medium text-gray-900 mb-2">
                            {attribute.displayName}
                            {attribute.required && <span className="text-red-600 ml-1">*</span>}
                        </label>
                        <input
                            type={attribute.type ?? "text"}
                            id={fieldName}
                            name={fieldName}
                            defaultValue={fieldValue as string}
                            autoComplete={attribute.autoComplete}
                            required={attribute.required}
                            onChange={handleFormChange}
                            onBlur={handleFormChange}
                            aria-invalid={hasError}
                            aria-describedby={hasError ? `input-error-${fieldName}` : undefined}
                            className={clsx(
                                "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                                "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none",
                                hasError ? "border-red-600 bg-red-50" : "border-gray-300 hover:border-gray-400"
                            )}
                        />
                        {hasError && (
                            <div className="flex items-center gap-2 mt-2">
                                <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span
                                    id={`input-error-${fieldName}`}
                                    className="text-sm text-red-600"
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{ __html: kcSanitize(errorMessage) }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
