import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

const MyGoogleMap = ({ latitude, longitude }) => {
    const mapRef = useRef(null);
    const [markerPosition, setMarkerPosition] = useState({ lat: latitude, lng: longitude });
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoContent, setInfoContent] = useState('');

    const mapContainerStyle = {
        width: '100%',
        height: '600px',
    };

    // lat와 lng 값을 Number로 변환하고 NaN인지 확인
    const lat = Number(latitude);
    const lng = Number(longitude);

    // 기본값 설정 (여기서는 서울의 위도와 경도로 설정)
    const center = {
        lat: isNaN(lat) ? 37.533816 : lat, // 서울의 위도
        lng: isNaN(lng) ? 126.896978 : lng,  // 서울의 경도
    };

    console.log(center);

    const onLoad = (map) => {
        mapRef.current = map; // 지도 참조 저장
    };

    const handleMapClick = (event) => {
        const position = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };

        setMarkerPosition(position); // 마커 위치 업데이트
        setInfoContent(`위치: ${position.lat}, ${position.lng}`); // InfoWindow 내용 업데이트
        setInfoOpen(true); // InfoWindow 열기
        mapRef.current.panTo(position); // 마커 클릭 시 해당 위치로 이동
    };

    const handleMarkerClick = () => {
        setInfoOpen(true);
        setInfoContent(`위치: ${markerPosition.lat}, ${markerPosition.lng}`);
    };

    // 부모 컴포넌트에서 전달받은 위도와 경도로 markerPosition 업데이트
    useEffect(() => {
        if (!isNaN(lat) && !isNaN(lng)) {
            setMarkerPosition({ lat, lng });
        }
    }, [latitude, longitude]); // latitude와 longitude가 변경될 때마다 실행

    return (
        <LoadScript googleMapsApiKey="AIzaSyA0q9MG88Xtwf3xXQ5ep5WAf-9cAzHH8Ys">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                onLoad={onLoad}
                onClick={handleMapClick} // 지도 클릭 시 마커 위치 변경
            >
                {/* Marker 표시 */}
                <Marker
                    position={markerPosition} // 마커 위치를 상태로 설정
                    onClick={handleMarkerClick} // 마커 클릭 시 위치 정보 표시
                />
                {/* InfoWindow 표시 */}
                {infoOpen && (
                    <InfoWindow
                        position={markerPosition} // 마커 위치에 InfoWindow 표시
                        onCloseClick={() => setInfoOpen(false)} // InfoWindow 닫기
                    >
                        <div>{infoContent}</div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
}

export default MyGoogleMap;
