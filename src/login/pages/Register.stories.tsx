import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
    title: "login/register.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithErrors: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                        const fieldNames = [fieldName, ...otherFieldNames];
                        return (
                            fieldNames.includes("username") ||
                            fieldNames.includes("email") ||
                            fieldNames.includes("password") ||
                            fieldNames.includes("password-confirm")
                        );
                    },
                    get: (fieldName: string) => {
                        const errors: Record<string, string> = {
                            username: "Username already in use",
                            email: "Invalid email address",
                            password: "Password must be at least 8 characters",
                            "password-confirm": "Passwords do not match"
                        };
                        return errors[fieldName] || "";
                    }
                }
            }}
        />
    )
};

export const WithPrefilledData: Story = {
    render: () => <KcPageStory />
};

export const WithTermsRequired: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                termsAcceptanceRequired: true
            }}
        />
    )
};

export const WithRecaptcha: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                recaptchaRequired: true,
                recaptchaVisible: true,
                recaptchaSiteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            }}
        />
    )
};

export const WithTermsAndRecaptcha: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                termsAcceptanceRequired: true,
                recaptchaRequired: true,
                recaptchaVisible: true,
                recaptchaSiteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            }}
        />
    )
};

export const WithValidationError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                        const fieldNames = [fieldName, ...otherFieldNames];
                        return (
                            fieldNames.includes("username") ||
                            fieldNames.includes("email") ||
                            fieldNames.includes("firstName") ||
                            fieldNames.includes("lastName")
                        );
                    },
                    get: (fieldName: string) => {
                        const errors: Record<string, string> = {
                            username: "Username is required",
                            email: "Email must be a valid email address",
                            firstName: "First name is required",
                            lastName: "Last name is required"
                        };
                        return errors[fieldName] || "";
                    }
                }
            }}
        />
    )
};

export const WithEmailAsUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm: { registrationEmailAsUsername: true }
            }}
        />
    )
};

export const WithPasswordReset: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    type: "info",
                    summary: "Password reset link has been sent to your email. Check your inbox to reset your password."
                }
            }}
        />
    )
};

export const WithoutPasswordField: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                passwordRequired: false,
                message: {
                    type: "info",
                    summary: "A password will be provided to you via email."
                }
            }}
        />
    )
};
