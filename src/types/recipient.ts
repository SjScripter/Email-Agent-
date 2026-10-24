export type Recipient = {
  name: string;
  schoolName: string;
  email: string;
};

export type RecipientWithStatus = Recipient & {
  status: "Valid" | "Invalid" | "Duplicate";
  selected: boolean;
};
