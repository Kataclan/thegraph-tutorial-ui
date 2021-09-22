import gql from "graphql-tag";
import styles from "../styles/Home.module.css";
import { client, tokensQuery } from "./api/hello";

export default function Home(props) {
  return (
    <div className={styles.container}>
      {props.tokens.map((token) => {
        return (
          <div
            key={token.id}
            className="shadow-lg bg-transparent rounded-2xl overflow-hidden"
          >
            <div key={token.contentURI} className="w-100% h-100%">
              {token.type === "image" && (
                <div style={{ height: "320px", overflow: "hidden" }}>
                  <img style={{ minHeight: "320px" }} src={token.contentURI} />
                </div>
              )}
              {token.type === "video" && (
                <div className="relative">
                  <div
                    style={{
                      width: "288px",
                      height: "320px",
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                    }}
                  >
                    <video
                      height="auto"
                      controls
                      autoPlay
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "cover",
                      }}
                    >
                      <source src={token.contentURI} />
                    </video>
                  </div>
                </div>
              )}
              {token.type === "audio" && (
                <audio controls>
                  <source src={token.contentURI} type="audio/ogg" />
                  <source src={token.contentURI} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              <div className="px-2 pt-2 pb-10">
                <h3
                  style={{ height: 100 }}
                  className="text-2xl p-4 pt-6 font-semibold"
                >
                  {token.meta.name}
                </h3>
              </div>
            </div>
            <div className="bg-black p-10">
              <p className="text-white">Price</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

async function fetchData() {
  const { data, error } = await client.query({ query: gql(tokensQuery) });

  let tokenData = await Promise.all(
    data.tokens?.map(async (token) => {
      let meta;
      try {
        const metaData = await fetch(token.metadataURI);
        let response = await metaData.json();
        meta = response;
      } catch (err) {}
      if (!meta) return;
      if (meta.mimeType) {
        if (meta.mimeType?.includes("mp4")) {
          token = { ...token, type: "video" };
        } else if (meta.mimeType.includes("wav")) {
          token = { ...token, type: "audio" };
        } else {
          token = { ...token, type: "image" };
        }
      }
      token = { ...token, meta };
      return token;
    })
  );

  return tokenData;
}

export async function getServerSideProps() {
  const data = await fetchData();
  return {
    props: {
      tokens: data,
    },
  };
}
