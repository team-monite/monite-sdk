import mqtt, { MqttClient } from 'mqtt';

import type { DemoDataGenerationMessage } from '@/lib/monite-api/demo-data-generator/generate-payables';

export const createMqttMessenger = (topic: string) => {
  const mqttClient: MqttClient = mqtt.connect(
    `mqtt://localhost:${process.env.DEMO_DATA_GENERATOR_MQTT_SERVER_PORT}`
  );

  return {
    publishMessage: (message: DemoDataGenerationMessage) => {
      mqttClient.publish(topic, JSON.stringify(message));
    },
    closeMqttConnection: () => mqttClient.end(),
  };
};
