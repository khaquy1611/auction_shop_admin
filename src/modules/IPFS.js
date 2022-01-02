import {create} from "ipfs-http-client";

const ipfs = create('https://ipfs.infura.io:5001/api/v0');

export default ipfs;