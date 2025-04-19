"use server";

import SaveCodeToFile from "@/functions/saveCodeToFile";
import { getStorage } from "firebase-admin/storage";
import { initAdmin } from "./firebaseAdmin";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import axios from "axios";

export default async function handelCode(value: string) {
  try {
    initAdmin();

    const filePath = SaveCodeToFile(value, "del");
    console.log("File saved at:", filePath);

    const bucket = getStorage().bucket();

    // Upload the file to Firebase Storage
    const res = await bucket.upload(filePath, {
      metadata: {
        contentType: "text/plain",
      },
    });

    const downloadUrl = await res[0].getSignedUrl({
      action: "read",
      expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
      version: "v4",
    });
    // console.log("File uploaded to Firebase Storage:", downloadUrl[0]);
    // create a db entry with the download URL
    const db = getFirestore("code-compilation");
    const docRef = db.collection(
      process.env.NEXT_PUBLIC_COLLECTION_NAME as string
    );

    const dataRes = await db.collection("code-compile").add({
      InputfileLink: downloadUrl[0],
      status: "queued",
      finishedAt: null,
      language: "delirium",
      outputFileLink: null,
      codeStatus: "pending",
      createdAt: Timestamp.now(),
    });
    const docId = dataRes.id;
    console.log("Document written with ID: ", docId);

    const url = "https://compiler-test-1084173791820.us-central1.run.app";
    const response = await axios.post(url, {
      docID: docId,
    });
    if (response.status !== 200) {
      return false;
    }
    // refetch the document to get the output file link

    const docRef2 = db.collection("code-compile").doc(docId);
    const doc = await docRef2.get();
    if (!doc.exists) {
      console.log("No such document!");
      return false;
    }
    const data = doc.data();
    if (!data) {
      console.log("No data found!");
      return false;
    }
    const outputFileLink = data.outputFileLink;

    // download the output file from link and get the tetxt content
    const outputFile = await axios.get(outputFileLink, {
      responseType: "arraybuffer",
    });
    const outputFileText = Buffer.from(outputFile.data, "binary").toString(
      "utf-8"
    );
    console.log("Output file text:", outputFileText);

    return outputFileText;
  } catch (error) {
    console.error(
      "Error during file upload or Firebase storage interaction:",
      error
    );
  }
}
