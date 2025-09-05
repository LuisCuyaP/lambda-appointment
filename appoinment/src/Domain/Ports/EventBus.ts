export interface EventBus {
  publish(
    eventName: string,
    payload: unknown,
    attributes?: Record<string, string>
  ): Promise<void>;
}