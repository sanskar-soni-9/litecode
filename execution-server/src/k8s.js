const { KubeConfig, CoreV1Api } = require("@kubernetes/client-node");

const namespace = "default";
const pollingInterval = 500;
const maxIntervalCount = 5;

const kc = new KubeConfig();
kc.loadFromCluster();

const coreApi = kc.makeApiClient(CoreV1Api);

const generateRandomPodName = () => {
  const baseName = "python-execution-pod";
  const randomSuffix = Math.random().toString(36).substring(7);
  const timestamp = new Date().getTime();
  return `${baseName}-${timestamp}-${randomSuffix}`;
};

const getPodManifest = (podName, code) => {
  return {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: podName,
    },
    spec: {
      containers: [
        {
          name: "python-container",
          image: "python:3",
          command: ["python", "-c", code],
          restartPolicy: "Never",
        },
      ],
    },
  };
};

const checkPodContainerTermination = async (podName) => {
  try {
    const pod = await coreApi.readNamespacedPodStatus(podName, namespace);
    return pod?.body?.status?.containerStatuses
      ? !!pod.body.status.containerStatuses[0].state.terminated
      : false;
  } catch (error) {
    console.error("Error checking pod status:", error);
    return false;
  }
};

const handleExecution = (podName) => {
  return new Promise(async (resolve) => {
    let isTerminated = false;
    let intervalCount = 0;

    while (intervalCount < maxIntervalCount) {
      isTerminated = await checkPodContainerTermination(podName);

      if (isTerminated) {
        const logsResponse = await coreApi.readNamespacedPodLog(
          podName,
          namespace,
        );
        resolve(
          logsResponse.body
            ? typeof logsResponse.body === "string"
              ? logsResponse.body
              : JSON.stringify(logsResponse.body)
            : "",
        );
        return;
      }
      intervalCount++;
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    }
    resolve("Time Limit Reached.");
  });
};

const executePythonCode = (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const podName = generateRandomPodName();
      const podResponse = await coreApi.createNamespacedPod(
        namespace,
        getPodManifest(podName, code),
      );
      console.log("Pod created:", podResponse.body.metadata.name);
      const logs = await handleExecution(podName);
      logs && (await coreApi.deleteNamespacedPod(podName, namespace));
      resolve(logs);
    } catch (error) {
      console.error("Error creating Job:", error?.body?.message || error);
      reject(error);
    }
  });
};

module.exports = { executePythonCode };
