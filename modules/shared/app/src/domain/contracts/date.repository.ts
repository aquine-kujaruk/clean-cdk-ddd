export interface DateRepository {
  getUnixMilliseconds(): number;
  getDynamoDbFriendlyTimestamp(): string;
}
