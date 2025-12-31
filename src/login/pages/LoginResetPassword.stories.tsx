import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-reset-password.ftl" });

const meta = {
    title: "login/login-reset-password.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithInvalidUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                        const fieldNames = [fieldName, ...otherFieldNames];
                        return fieldNames.includes("username");
                    },
                    get: (fieldName: string) => {
                        if (fieldName === "username") {
                            return "User not found";
                        }
                        return "";
                    }
                }
            }}
        />
    )
};

export const WithPresetUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                auth: {
                    attemptedUsername: "john@example.com"
                }
            }}
        />
    )
};

export const WithSuccessMessage: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    type: "success",
                    summary: "You should receive an email shortly with further instructions on how to reset your password."
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

export const WithUsernameOrEmailField: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm: {
                    loginWithEmailAllowed: true,
                    registrationEmailAsUsername: false
                }
            }}
        />
    )
};

export const WithPasswordResetDisabled: Story = {
    render: () => <KcPageStory />
};

export const WithInfoMessage: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    type: "info",
                    summary: "Enter your username or email address and we will send you instructions on how to create a new password."
                }
            }}
        />
    )
};

export const WithErrorMessage: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    type: "error",
                    summary: "Password reset has been disabled."
                }
            }}
        />
    )
};
