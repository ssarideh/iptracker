import { useEffect, useMemo } from "react";
import { useMap, Marker, Popup } from "react-leaflet";
import icon from "./icon";

const Markerposition = ({ address }) => {
  const position = useMemo(() => {
    const lat = address?.location?.lat;
    const lng = address?.location?.lng;

    if (lat !== undefined && lng !== undefined) {
      return [lat, lng];
    }

    return [0, 0];
  }, [address?.location?.lat, address?.location?.lng]);

  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true,
    });
  }, [map, position]);

  return (
    <>
      <Marker icon={icon} position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </>
  );
};

export default Markerposition;
