// import { config, query } from "@onflow/fcl";

// export const customCallBlockChain = async (dataSend) => {
//     config().put("accessNode.api", "https://access-testnet.onflow.org");
//     const cadence = dataSend;
//     const dataSample = await query({ cadence });
//   return dataSample;
// }

export const configS3 = {
    bucketName: process.env.REACT_APP_BUCKET_NAME_AWS,
    dirName: process.env.REACT_APP_DIR_NAME_AWS,
    region: process.env.REACT_APP_REGION_AWS,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY_AWS,
    s3Url: ""
}

export const PAGE_SIZE = 10

export const JOB_STATUS = {
    COMPLETE: "Complete",
    ERROR: "Error",
    ACCEPTED: "Accepted",
}