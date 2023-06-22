import axios from 'axios';
import { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { useTheme } from 'next-themes';

const OTPComponent = () => {
	const [otp, setOtp] = useState('');
	const { theme } = useTheme();

	useEffect(() => {
		console.log(otp);
	}, [otp]);

	return (
		<>
			<form className="flex flex-col gap-y-2">
				<OtpInput
					value={otp}
					onChange={setOtp}
					numInputs={4}
					separator={<span>&nbsp;&nbsp;</span>}
					containerStyle={{
						color: 'black',
					}}
					inputStyle={{
						color: theme === 'light' ? '#1a1a1a' : '#f0f0f0',
						width: '3rem',
						border: '1px solid transparent',
						backgroundColor: theme === 'light' ? '#f0f0f0' : '#1a1a1a',
						fontSize: '1.5rem',
						textAlign: 'center',
						borderRadius: '0.5rem',
					}}
					focusStyle={{
						outline: 'none',
					}}
					isInputNum
					errorStyle={{
						color: theme === 'light' ? '#7F1C1D' : '#EF4444',
						backgroundColor: theme === 'light' ? '#FEE2E1' : '#7F1C1D50',
					}}
				/>
			</form>
		</>
	);
};

export default OTPComponent;
