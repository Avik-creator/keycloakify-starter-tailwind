import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "account.ftl" });

const meta = {
    title: "account/account.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithUserData: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "johndoe",
                    email: "john@example.com",
                    firstName: "John",
                    lastName: "Doe"
                }
            }}
        />
    )
};

export const WithValidationErrors: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "johndoe",
                    email: "john@example.com",
                    firstName: "John",
                    lastName: "Doe"
                },
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                        const fieldNames = [fieldName, ...otherFieldNames];
                        return fieldNames.includes("email") || fieldNames.includes("firstName");
                    },
                    get: (fieldName: string) => {
                        const errors: Record<string, string> = {
                            email: "This email is already in use",
                            firstName: "First name is required"
                        };
                        return errors[fieldName] || "";
                    }
                }
            }}
        />
    )
};

export const WithEditableUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "johndoe",
                    email: "john@example.com",
                    firstName: "John",
                    lastName: "Doe"
                },
                realm: { editUsernameAllowed: true }
            }}
        />
    )
};

export const WithoutUsernameField: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "john@example.com",
                    email: "john@example.com",
                    firstName: "John",
                    lastName: "Doe"
                },
                realm: { registrationEmailAsUsername: true }
            }}
        />
    )
};

export const WithSuccessMessage: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "johndoe",
                    email: "john@example.com",
                    firstName: "John",
                    lastName: "Doe"
                },
                message: {
                    type: "success",
                    summary: "Your account has been updated successfully."
                }
            }}
        />
    )
};

export const WithErrorMessage: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "johndoe",
                    email: "john@example.com",
                    firstName: "John",
                    lastName: "Doe"
                },
                message: {
                    type: "error",
                    summary: "Failed to update account. Please try again."
                }
            }}
        />
    )
};

export const MinimalData: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "user123",
                    email: "user@example.com"
                }
            }}
        />
    )
};

export const WithReferrer: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: "johndoe",
                    email: "john@example.com",
                    firstName: "John",
                    lastName: "Doe"
                },
                referrer: {
                    url: "https://example.com"
                }
            }}
        />
    )
};
