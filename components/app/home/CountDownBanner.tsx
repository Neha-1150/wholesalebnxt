import Link from 'next/link';
import Countdown, { zeroPad } from 'react-countdown';

const CountDownBanner = ({ url, imgUrl, endTime, bgColor = '#000', fgColor = '#FFF', blockStyles }) => {
	return (
		<Countdown
				date={endTime}
				zeroPadTime={2}
				zeroPadDays={2}
				daysInHours={true}
				renderer={({ hours, minutes, seconds, days, completed }) => {
					let separateHours = zeroPad(hours)?.split('');
					if (completed) {
						// Render a completed state
						return <div className="absolute bottom-0 text-amber-600 dark:text-amber-400">Offer Ended</div>;
					} else {
						// Render a countdown
						return (
							// <div className="absolute bottom-[20px] -translate-x-1/2 left-1/2">
							<div style={blockStyles?.counterWrapper}>
								<div className="text-4xl font-extrabold text-white">
									<span className="px-2 py-1.5 rounded-md mx-1" style={blockStyles?.counter}>
										{zeroPad(days)}
									</span>
									<span style={{ color: `${fgColor}` }}>:</span>
									<span className="px-2 py-1.5 rounded-md mx-1" style={blockStyles?.counter}>
										{zeroPad(hours)}
									</span>
									<span style={{ color: `${fgColor}` }}>:</span>
									<span className="px-2 py-1.5 rounded-md mx-1" style={blockStyles?.counter}>
										{zeroPad(minutes)}
									</span>
									<span style={{ color: `${fgColor}` }}>:</span>
									<span className="px-2 py-1.5 rounded-md mx-1" style={blockStyles?.counter}>
										{zeroPad(seconds)}
									</span>
								</div>
							</div>
						);
					}
				}}
			/>
	);
};

export default CountDownBanner;
