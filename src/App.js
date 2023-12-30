import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg-desktop.png";
import Markerposition from "./Markerposition";

function App() {
  const baseUrl = "https://geo.ipify.org/api/v2";
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
  const apiKey = useMemo(() => process.env.REACT_APP_API_KEY, []);

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          ` ${baseUrl}/country,city?apiKey=${apiKey}&ipAddress=192.212.174.101`
        );
        const data = await res.json();
        setAddress(data);
      };
      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  async function getEnteredAddress() {
    try {
      const res = await fetch(
        ` ${baseUrl}/country,city?apiKey=${apiKey}&${
          checkIpAddress.test(ipAddress)
            ? `ipAddress=${ipAddress}`
            : checkDomain.test(ipAddress)
            ? `domain=${ipAddress}`
            : ""
        }`
      );
      if (!res.ok) {
        throw new Error(
          `Failed to fetch data: ${res.status} - ${res.statusText}`
        );
      }
      const data = await res.json();
      setAddress(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    getEnteredAddress();
    setIpAddress("");
  }

  return (
    <>
      <section>
        <div className="absolute -z-10">
          <img src={background} className="w-full h-80 object-cover" />
        </div>
        <article className="p-8">
          <h1 className="text-2xl lg:text-3xl text-black font-bold text-center mb-8">
            IP Address Tracker
          </h1>

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="flex justify-center max-w-lg mx-auto"
          >
            <input
              type="text"
              name="ipaddress"
              id="ipaddress"
              placeholder="Search for any IP Address or domain"
              required
              className="py-2 px-4 rounded-l-lg outline-none w-full"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black py-4 px-4 rounded-r-lg hover:opacity-60 transition-all delay-150"
            >
              <img src={arrow} />
            </button>
          </form>
        </article>

        {address && (
          <>
            <article className="bg-white shadow rounded-lg p-3 md:p-7 mx-8 grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl xl:mx-auto text-center md:text-left -mb-56 md:-mb-16 relative z-[1000]">
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase font-bold text-sm text-slate-400 tracking-wider mb-3">
                  IP Address
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address?.ip}
                </p>
              </div>
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase font-bold text-sm text-slate-400 tracking-wider mb-3">
                  Location
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address?.location?.city}, {address?.location?.region}
                </p>
              </div>
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase font-bold text-sm text-slate-400 tracking-wider mb-3">
                  Timezone
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  UTC {address?.location?.timezone}
                </p>
              </div>
              <div className="">
                <h2 className="uppercase font-bold text-sm text-slate-400 tracking-wider mb-3">
                  Isp
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address?.isp}
                </p>
              </div>
            </article>

            <MapContainer
              center={[address?.location?.lat, address?.location?.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "700px", width: "100vw" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Markerposition address={address} />
            </MapContainer>
          </>
        )}
      </section>
    </>
  );
}

export default App;
