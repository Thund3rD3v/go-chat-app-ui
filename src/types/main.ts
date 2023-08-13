export type TMessage = {
  id: number;
  userId: number;
  value: string;
  user: {
    id: number;
    username: string;
  };
};
