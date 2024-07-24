export interface IDateRepository {
  getUnixMilliseconds(): number;
  getDynamoDbFriendlyTimestamp(): string;
}
