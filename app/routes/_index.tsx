import React, { useState, useEffect } from "react";
import { Parallax, ParallaxLayer, IParallax } from "@react-spring/parallax";
import debounce from "lodash/debounce";

import { useSpring, useScroll, animated } from "@react-spring/web";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	const name = url.searchParams.get("name");
	return { name };
};

const url = (name: string, wrap = false) =>
	`${wrap ? "url(" : ""}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ")" : ""}`;

const ImagesWithLoading = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const images = [
		"/assets/frame/frame-37.png",
		"/assets/frame/galery-01.jpg",
		"/assets/frame/galery-02.jpg",
		"/assets/frame/galery-03.jpg",
		"/assets/frame/background/cover-7.png",
		"/assets/frame/background/cover-8.png",
		"/assets/frame/background/cover-9.png",
		"/assets/frame/background/cover-2.png",
		"/assets/frame/background/cover-1.png",
	]; // Daftar gambar yang ingin dimuat
	const [loadedImages, setLoadedImages] = useState<string[]>([]);

	useEffect(() => {
		let isMounted = true; // Untuk mencegah setState jika komponen sudah unmount
		const loadImages = async () => {
			setIsLoading(true);
			try {
				const promises = images.map((src) => {
					return new Promise<string>((resolve, reject) => {
						const img = new Image();
						img.src = src;

						img.onload = () => resolve(src);
						img.onerror = () => reject(new Error(`Failed to load ${src}`));
					});
				});

				const results = await Promise.all(promises);
				if (isMounted) {
					setLoadedImages(results);
					setIsLoading(false);
				}
			} catch (error) {
				if (isMounted) {
					setIsError(true);
					setIsLoading(false);
				}
			}
		};

		loadImages();

		return () => {
			isMounted = false; // Cleanup untuk menghindari memory leaks
		};
	}, []);

	return (
		<>
			{isLoading && !isError && (
				<div className="flex items-center justify-center h-screen">
					<div
						aria-label="Loading..."
						role="status"
						className="flex items-center space-x-2"
					>
						<svg
							className="h-20 w-20 animate-spin stroke-gray-500"
							viewBox="0 0 256 256"
						>
							<line
								x1={128}
								y1={32}
								x2={128}
								y2={64}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={24}
							/>
							<line
								x1="195.9"
								y1="60.1"
								x2="173.3"
								y2="82.7"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={24}
							/>
							<line
								x1={224}
								y1={128}
								x2={192}
								y2={128}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={24}
							></line>
							<line
								x1="195.9"
								y1="195.9"
								x2="173.3"
								y2="173.3"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={24}
							/>
							<line
								x1={128}
								y1={224}
								x2={128}
								y2={192}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={24}
							></line>
							<line
								x1="60.1"
								y1="195.9"
								x2="82.7"
								y2="173.3"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={24}
							/>
							<line
								x1={32}
								y1={128}
								x2={64}
								y2={128}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={24}
							/>
							<line
								x1="60.1"
								y1="60.1"
								x2="82.7"
								y2="82.7"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={24}
							></line>
						</svg>
						<span className="text-4xl font-medium text-gray-500">
							Loading...
						</span>
					</div>
				</div>
			)}
			{!isLoading && !isError && <App />}
			{isError && (
				<div style={{ textAlign: "center", paddingTop: "50%" }}>
					<p>Failed to load assets.</p>
				</div>
			)}
		</>
	);
};

export default ImagesWithLoading;

function App() {
	const parallax = useRef<IParallax>(null!);
	const { name } = useLoaderData();
	const currentdata = parallax?.current?.offset;
	const [activeOffset, setActiveOffset] = useState(0);

	const springs = useSpring({
		from: { y: 0, transform: "scale(1)" },
		to: { y: -20, transform: "scale(1.7)" },
		config: { tension: 40, friction: 60 },
		onResolve: activeOffset === 0 ? goOne() : null,
	});

	function goOne() {
		setTimeout(() => {
			parallax.current.scrollTo(1);
			setActiveOffset(1);
		}, 1500);
	}

	const springs2 = useSpring({
		from: { transform: "scale(2)", opacity: 1 },
		to: { transform: "scale(1.5)", opacity: 1 },
		config: { tension: 60, friction: 60 },
	});

	const springs3 = useSpring({
		transform: activeOffset === 1 ? "scale(1.3)" : "scale(2)",
		y: activeOffset === 1 ? 0 : 100,
		config: { tension: 60, friction: 60 },
		delay: 700,
		reset: activeOffset === 1, //
	});

	const springs4 = useSpring({
		transform: activeOffset === 1 ? "scale(1.2)" : "scale(2)",
		y: activeOffset === 1 ? 0 : -100,
		config: { tension: 60, friction: 60 },
		delay: 100,
		reset: activeOffset === 1, //
	});
	const springs5 = useSpring({
		transform: activeOffset === 1 ? "scale(1)" : "scale(1.5)",
		opacity: activeOffset === 1 ? 1 : 0,
		config: { tension: 80, friction: 60 },
		delay: 2000,
		reset: activeOffset === 1, //
	});
	const springs6 = useSpring({
		transform: activeOffset === 1 ? "scale(1)" : "scale(1.5)",
		opacity: activeOffset === 1 ? 1 : 0,
		config: { tension: 80, friction: 60 },
		delay: 3000,
		reset: activeOffset === currentdata, //
	});
	const springs7 = useSpring({
		transform: activeOffset === 1 ? "scale(1)" : "scale(1.5)",
		opacity: activeOffset === 1 ? 1 : 0,
		config: { tension: 80, friction: 60 },
		delay: 3500,
		reset: activeOffset === 1, //
	});

	const springs8 = useSpring({
		transform: activeOffset === 2 ? "scale(1.3)" : "scale(1.5)",
		config: { tension: 80, friction: 60 },
		delay: 700,
		reset: activeOffset === 2, //
	});
	const springsTwo = useSpring({
		transform: activeOffset === 2 ? "scale(0.75)" : "scale(2)",
		y: activeOffset === 2 ? 80 : 0,
		config: { tension: 80, friction: 60 },
		delay: 300,
		reset: activeOffset === 2, //
	});
	const springs8d = useSpring({
		transform: activeOffset === 3 ? "scale(1)" : "scale(1.5)",
		opacity: activeOffset === 3 ? 1 : 0,
		config: { tension: 80, friction: 60 },
		delay: 300,
		reset: activeOffset === 3, //
	});
	const springs9 = useSpring({
		transform: activeOffset === 2 ? "scale(1)" : "scale(1.5)",
		y: activeOffset === 2 ? 0 : 500,
		config: { tension: 80, friction: 60 },
		delay: 1400,
		reset: activeOffset === 2, //
	});
	const springs9d = useSpring({
		transform: activeOffset === 3 ? "scale(1)" : "scale(1.5)",
		opacity: activeOffset === 3 ? 1 : 0,
		y: activeOffset === 3 ? 0 : 500,
		config: { tension: 80, friction: 60 },
		delay: 1400,
		reset: activeOffset === 3, //
	});
	const springs10 = useSpring({
		transform: activeOffset === 4 ? "scale(1.3)" : "scale(2)",
		config: { tension: 60, friction: 60 },
		delay: 300,
		reset: activeOffset === 4, //
	});
	const springs10a = useSpring({
		transform: activeOffset === 4 ? "scale(1)" : "scale(2)",
		config: { tension: 60, friction: 60 },
		delay: 300,
		reset: activeOffset === 4, //
	});
	const springs13 = useSpring({
		transform: activeOffset === 5 ? "scale(1)" : "scale(2)",
		config: { tension: 60, friction: 60 },
		delay: 300,
		reset: activeOffset === 5, //
	});
	const springs12 = useSpring({
		transform: activeOffset === 5 ? "scale(1.3)" : "scale(2)",

		x: activeOffset === 5 ? 0 : -100,
		config: { tension: 60, friction: 60 },
		delay: 300,
		reset: activeOffset === 4, //
	});
	const springs12a = useSpring({
		transform: activeOffset === 5 ? "scale(1.4)" : "scale(2)",

		x: activeOffset === 5 ? 0 : -100,
		config: { tension: 60, friction: 60 },
		delay: 300,
		reset: activeOffset === 4, //
	});
	const springs11 = useSpring({
		transform: activeOffset === 5 ? "scale(1)" : "scale(2)",
		opacity: activeOffset === 5 ? 1 : 0,
		x: activeOffset === 5 ? 0 : 300,
		config: { tension: 60, friction: 60 },
		delay: 2000,
		reset: activeOffset === 5, //
	});

	return (
		<div className="flex items-center justify-center h-screen">
			<Parallax
				ref={parallax}
				pages={9}
				style={{
					maxWidth: "28rem",
					width: "100%",
					height: "100vh",
					overflow: "hidden",
					backgroundColor: "#222615",
				}}
			>
				<ParallaxLayer
					offset={0}
					speed={0.5}
					onClick={() => {
						parallax.current.scrollTo(1);
						setActiveOffset(1);
					}}
				>
					<div className="relative h-screen">
						<animated.div
							style={{
								...springs2,
								position: "absolute",
								top: "40px",
								zIndex: "1",
							}}
						>
							<img src="/assets/frame/background/cover-2.png" />
						</animated.div>
						<animated.div
							style={{
								...springs,
								position: "absolute",
								top: "-0px",
								zIndex: "-1",
							}}
						>
							<img src="/assets/frame/background/cover-7.png" />
						</animated.div>
					</div>
				</ParallaxLayer>
				{/*LAYER 1*/}
				<ParallaxLayer
					offset={1}
					speed={0.5}
					style={{
						display: "flex",
						alignItems: "start",
						position: "relative",
						justifyContent: "center",
						zIndex: "3",
					}}
				>
					<animated.div
						style={{
							...springs3,
							position: "absolute",
						}}
					>
						<img src="/assets/frame/background/cover-1.png" />
					</animated.div>
				</ParallaxLayer>
				<ParallaxLayer
					offset={1}
					speed={0.5}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: "3",
					}}
				>
					<animated.div
						style={{
							...springs4,
							position: "absolute",
							bottom: "65px",
						}}
					>
						<img src="/assets/frame/background/cover-2.png" />
					</animated.div>
					<div className="flex flex-col justify-between h-full py-10">
						<animated.div
							style={{
								...springs5,
								zIndex: "3",
							}}
						>
							<div className="text-center space-y-1.5">
								<h2 className="text-[#231F1E] text-2xl font-baskervville font-medium">
									THE WEDING OF
								</h2>
								<h2 className="text-[#231F1E] text-6xl font-edwardian font-medium">
									Nabila & Alvin
								</h2>
								<h2 className="text-[#231F1E] text-2xl font-baskervville font-medium">
									15.12.24
								</h2>
							</div>
						</animated.div>
						<animated.div
							style={{
								...springs6,
								zIndex: "3",
							}}
						>
							<div className="flex flex-col items-center justify-center gap-y-16 pb-7">
								<div className="text-white font-baskervville text-lg text-center">
									<p>Dear,</p>
									<p>{name}</p>
								</div>

								<animated.div
									style={{
										...springs7,
									}}
								>
									<div className="flex flex-col items-center gap-3">
										<p className="text-white font-baskervville max-w-xs text-center">
											Kindly note that this invitation is for the named
											recipient(s) only.
										</p>
										<button
											onClick={() => {
												parallax.current.scrollTo(2);
												setActiveOffset(2);
											}}
											className="font-baskervville uppercase text-white ring-2 ring-white rounded-full py-1.5 px-4 font-bold hover:bg-white/10 duration-300"
										>
											Buka Undangan
										</button>
									</div>
								</animated.div>
							</div>
						</animated.div>
					</div>
				</ParallaxLayer>
				{/*LAYER 2*/}
				<ParallaxLayer
					speed={0.5}
					offset={2}
					onClick={() => {
						parallax.current.scrollTo(3);
						setActiveOffset(3);
					}}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div className="relative h-screen">
						<animated.div
							style={{
								...springs8,
								position: "absolute",
								top: "10px",
								zIndex: "1",
							}}
						>
							<img
								src="/assets/frame/background/cover-2.png"
								className="scale-150"
							/>
						</animated.div>

						<animated.div
							style={{
								position: "absolute",
								bottom: "0px",
								zIndex: "2",
								...springsTwo,
							}}
						>
							<img src="/assets/frame/background/two-person.png" />
						</animated.div>
						<animated.div
							style={{
								position: "absolute",
								...springs8,
								bottom: "50px",
								zIndex: "1",
							}}
						>
							<img
								src="/assets/frame/background/cover-3.png"
								className="scale-[105%]"
							/>
						</animated.div>
						<animated.div
							style={{
								position: "absolute",
								top: "0px",
								...springs8,
							}}
						>
							<img
								src="/assets/frame/background/cover-6.png"
								className="scale-110"
							/>
						</animated.div>
						<div className="pt-10">
							<animated.div
								style={{
									...springs9,
								}}
							>
								<Countdown />
							</animated.div>
						</div>
					</div>
				</ParallaxLayer>
				{/*LAYER 3*/}
				<ParallaxLayer
					offset={3}
					speed={0.5}
					onClick={() => {
						parallax.current.scrollTo(4);
						setActiveOffset(4);
					}}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<animated.div
						style={{
							...springs8d,
							position: "absolute",
							top: "-20px",
							zIndex: "1",
						}}
					>
						<img src="/assets/frame/background/cover-2.png" />
					</animated.div>

					<animated.div
						style={{
							position: "absolute",
							bottom: "-140px",
							zIndex: "2",
						}}
					>
						<img
							src="/assets/frame/background/two-person.png"
							className="scale-50"
						/>
					</animated.div>
					<animated.div
						style={{
							...springs8d,
							bottom: "0px",
							position: "absolute",
							zIndex: "1",
						}}
					>
						<img src="/assets/frame/background/cover-3.png" />
					</animated.div>
					<animated.div
						style={{
							position: "absolute",
							top: "-190px",
							...springs8d,
						}}
					>
						<img src="/assets/frame/background/cover-6.png" />
					</animated.div>
					<animated.div
						style={{
							position: "absolute",
							top: "0px",
							width: "100%",
							...springs9d,
						}}
					>
						<div className="flex items-center flex-col text-center space-y-1.5 py-5 bg-white/10 backdrop-blur-[4px] rounded-md mt-4">
							<img src="/assets/frame/kaligrafi.png" className="h-24" />
							<p className="font-baskervville max-w-sm text-lg mt-3 leading-5">
								Dengan penuh rasa syukur dan kebahagiaan, kami mengundang
								Bapak/Ibu/Saudara/i dalam acara pernikahan kami
							</p>
							<div className="flex items-center flex-col text-center">
								<p className="font-edwardian text-4xl">Nabila Ananda Putri</p>
								<p className="font-baskervville">
									Putri dari Bapak Tomtom Jaya Rivai & Ibu Prima Elisari
								</p>
								<button className="font-baskervville flex items-center gap-1 text-white rounded-full py-1.5 px-4 bg-[#272727] hover:bg-[#272727]/10 duration-300 mt-3">
									<InstagramIcon /> <span>@nabilaananda</span>
								</button>
							</div>
							<p className="font-edwardian text-center text-4xl">&</p>
							<div className="flex items-center flex-col text-center">
								<p className="font-edwardian text-4xl">
									Alvin Putra Priyambodo
								</p>
								<p className="font-baskervville">
									Putra dari Bapak Pramu Rahardjo (Alm.) & Ibu Endang Suparniati
								</p>
								<button className="font-baskervville flex items-center gap-1 text-white rounded-full py-1.5 px-4 bg-[#272727] hover:bg-[#272727]/10 duration-300 mt-3">
									<InstagramIcon /> <span>@alvinputrap02</span>
								</button>
							</div>
						</div>
					</animated.div>
				</ParallaxLayer>
				{/*LAYER 3*/}

				{/*LAYER 4*/}
				<ParallaxLayer
					offset={4}
					speed={0.5}
					onClick={() => {
						parallax.current.scrollTo(5);
						setActiveOffset(5);
					}}
				>
					<img
						src="/assets/frame/background/cover-7.png"
						className="scale-[200%]"
					/>
					<animated.div
						style={{
							position: "absolute",
							top: "10vh",
							...springs10,
						}}
					>
						<img
							src="/assets/frame/background/cover-7.png"
							className="scale-110"
						/>
					</animated.div>
					<animated.div
						style={{
							position: "absolute",
							bottom: "0px",
							zIndex: "3",
							...springs10a,
						}}
					>
						<img src="/assets/frame/background/cover-8.png" />
					</animated.div>
					<animated.div
						style={{
							...springs10,
							position: "absolute",
							top: "10vh",
							zIndex: "2",
						}}
					>
						<img src="/assets/frame/background/cover-9.png" />
					</animated.div>
				</ParallaxLayer>
				{/*LAYER 4*/}
				<ParallaxLayer
					offset={5}
					speed={0.5}
					onClick={() => {
						parallax.current.scrollTo(6);
						setActiveOffset(6);
					}}
					style={{
						height: "100vh",
						display: "flex",
						alignItems: "start",
						justifyContent: "center",
					}}
				>
					<animated.div
						style={{
							position: "absolute",
							top: "0px",
							...springs12a,
						}}
					>
						<img src="/assets/frame/background/cover-7.png" />
					</animated.div>
					<animated.div
						style={{
							position: "absolute",
							bottom: "0vh",
							zIndex: "2",
							...springs13,
						}}
					>
						<img src="/assets/frame/background/cover-8.png" />
					</animated.div>
					<animated.div
						style={{
							...springs12,
							position: "absolute",
							top: "10vh",
							zIndex: "1",
						}}
					>
						<img src="/assets/frame/background/cover-9.png" />
					</animated.div>
					<animated.div
						style={{
							...springs11,
							position: "absolute",
							top: "0px",
						}}
					>
						<div className="flex items-center flex-col text-center space-y-1.5 py-10 mt-5">
							<div className="flex items-center flex-col text-center space-y-1">
								<p className="font-edwardian text-4xl">Akad & Ramah Tamah</p>
								<p className="font-baskervville text-2xl">
									MINGGU, 15 DESEMBER 2024
								</p>
								<p className="font-baskervville text-xl">08.00 - 11.30 WIB</p>
								<p className="font-baskervville text-2xl">TJENDANA BISTRO</p>
								<p className="font-baskervville">
									Jl. Sukajadi No.181, Kota Bandung
								</p>
								<button className="font-baskervville flex items-center gap-1 text-white rounded-full py-1.5 px-4 bg-[#272727] hover:bg-[#272727]/10 duration-300 translate-y-3">
									Lihat Lokasi
								</button>
							</div>
						</div>
					</animated.div>
				</ParallaxLayer>

				<ParallaxLayer
					speed={0.5}
					offset={6}
					onClick={() => {
						parallax.current.scrollTo(7);
						setActiveOffset(7);
					}}
					style={{}}
				>
					<animated.div
						style={{
							position: "absolute",
							top: "0px",
							zIndex: "-1",
							...springs12,
						}}
					>
						<img src="/assets/frame/background/cover-7.png" className="" />
					</animated.div>
					<div className="mt-10">
						<fieldset className="grid gap-3 w-fit mx-3 pb-3 rounded-md ">
							<label
								htmlFor="ucapan"
								className="font-edwardian text-5xl text-center pb-1 pt-2 "
							>
								Outift Inspiration
							</label>
							<p className="text-center text-sm font-baskervville ">
								to fit the theme, you can wear your best 'Indonesian Heritage'
								look and put on a comfy shoes for semi-outdoor venue.
							</p>
						</fieldset>
						<div className="w-full mx-auto mt-5">
							<div className="grid grid-cols-2 gap-3 px-3">
								{/* image - start */}
								<a
									href="#"
									className="group relative flex h-60 items-end overflow-hidden rounded bg-gray-100 shadow-lg "
								>
									<img
										src="/assets/frame/galery-02.jpg"
										loading="lazy"
										alt="Photo by Magicle"
										className="absolute inset-0 h-full w-full sm:object-cover object-center transition duration-200 group-hover:scale-110"
									/>
									<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
								</a>

								<a
									href="#"
									className="group relative flex h-60 items-end overflow-hidden rounded bg-gray-100 shadow-lg "
								>
									<img
										src="/assets/frame/galery-01.jpg"
										loading="lazy"
										alt="Photo by Minh Pham"
										className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
									/>
									<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
								</a>
								<a
									href="#"
									className="group relative flex h-60 items-end overflow-hidden rounded bg-gray-100 col-span-2 "
								>
									<img
										src="/assets/frame/galery-03.jpg"
										loading="lazy"
										alt="Photo by Martin Sanchez"
										className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
									/>
									<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
								</a>
							</div>
						</div>
					</div>
				</ParallaxLayer>

				<ParallaxLayer
					offset={7}
					speed={0.5}
					style={{
						display: "flex",
						alignItems: "start",
						justifyContent: "center",
					}}
				>
					<Example parallax={parallax} setActiveOffset={setActiveOffset} />
				</ParallaxLayer>
				<ParallaxLayer
					offset={8}
					speed={0.5}
					onClick={() => {
						parallax.current.scrollTo(1);
						setActiveOffset(1);
					}}
					style={{
						display: "flex",
						alignItems: "start",
						justifyContent: "center",
					}}
				>
					<animated.div
						style={{
							position: "absolute",
							top: "0px",
							zIndex: "-1",
							...springs12,
						}}
					>
						<img src="/assets/frame/frame-37.png" className="" />
					</animated.div>
					<ExampleX />
				</ParallaxLayer>
			</Parallax>
		</div>
	);
}

import React, { useState, useEffect, useRef } from "react";

function Countdown() {
	const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => clearInterval(timer); // Bersihkan interval saat komponen dilepas
	}, []);

	function calculateTimeLeft() {
		const targetDate = new Date("2024-12-15T00:00:00");
		const now = new Date();
		const difference = targetDate.getTime() - now.getTime();

		if (difference <= 0) {
			return { days: 0, hours: 0, minutes: 0, seconds: 0 };
		}

		return {
			days: Math.floor(difference / (1000 * 60 * 60 * 24)),
			hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((difference / (1000 * 60)) % 60),
			seconds: Math.floor((difference / 1000) % 60),
		};
	}

	return (
		<div className="text-center py-10 mt-10">
			<h1 className="text-4xl font-edwardian">Minggu, 15 December 2024</h1>
			<div className="flex justify-center space-x-7 mt-4">
				<TimeBox value={timeLeft.days} label="Hari" />
				<TimeBox value={timeLeft.hours} label="Jam" />
				<TimeBox value={timeLeft.minutes} label="Menit" />
				<TimeBox value={timeLeft.seconds} label="Detik" />
			</div>

			<button className="font-baskervville capitalize text-white text-sm rounded-full py-1.5 px-4 font-bold bg-[#272727] hover:bg-[#272727]/10 duration-300 mt-3">
				Save the date
			</button>
		</div>
	);
}

function TimeBox({ value, label }: { value: number; label: string }) {
	return (
		<div className="flex flex-col items-center font-baskervville">
			<div className="text-4xl">{value}</div>
			<div className="text-sm">{label}</div>
		</div>
	);
}

const InstagramIcon = () => {
	return (
		<svg
			width="16"
			height="16"
			className="mb-0.5"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12.9091 12.909C13.2365 12.5817 13.4918 12.1895 13.6588 11.7577C13.8195 11.3443 13.9294 10.8718 13.961 10.1799C13.9926 9.48665 14.0001 9.26529 14.0001 7.50001C14.0001 5.73473 13.9926 5.51328 13.961 4.82008C13.9294 4.12821 13.8195 3.65573 13.6588 3.24228C13.4956 2.80857 13.2398 2.41567 12.9091 2.091C12.5844 1.76028 12.1915 1.50437 11.7578 1.34113C11.3443 1.18056 10.8718 1.0707 10.1799 1.03924C9.48675 1.00748 9.26537 1 7.50006 1C5.73476 1 5.51333 1.00748 4.82014 1.03912C4.12826 1.0707 3.65578 1.18056 3.24233 1.34125C2.80862 1.50447 2.41573 1.76032 2.09105 2.09098C1.76032 2.41563 1.5044 2.80852 1.34113 3.24225C1.18056 3.65573 1.0707 4.12821 1.03924 4.82008C1.00748 5.51328 1 5.73471 1 7.50001C1 9.26532 1.00748 9.48675 1.03924 10.1799C1.07083 10.8718 1.18069 11.3443 1.34138 11.7577C1.5046 12.1915 1.76045 12.5843 2.09111 12.909C2.41578 13.2397 2.80867 13.4955 3.24238 13.6587C3.65586 13.8194 4.12834 13.9293 4.82019 13.9609C5.51348 13.9925 5.73483 14 7.50012 14C9.2654 14 9.48685 13.9925 10.18 13.9609C10.8719 13.9293 11.3444 13.8194 11.7578 13.6587C12.1896 13.4917 12.5818 13.2364 12.9091 12.909ZM1.99949 6.73496C1.99974 6.94524 2.00005 7.19543 2.00005 7.50002C2.00005 7.80461 1.99974 8.0548 1.99949 8.26507C1.99849 9.08596 1.99824 9.29856 2.01963 9.7655C2.04625 10.3509 2.07823 10.7811 2.17588 11.1053C2.26976 11.417 2.37505 11.7342 2.7188 12.1171C3.06255 12.4999 3.39411 12.6733 3.81645 12.8007C4.23879 12.928 4.7696 12.9554 5.23052 12.9764C5.75332 13.0003 5.96052 13.0002 7.05714 12.9999L7.50006 12.9999C7.79304 12.9999 8.03569 13.0001 8.2409 13.0004C9.08195 13.0013 9.29425 13.0015 9.76575 12.9799C10.3512 12.9533 10.7814 12.9213 11.1056 12.8237C11.4173 12.7298 11.7345 12.6245 12.1173 12.2807C12.5001 11.937 12.6735 11.6054 12.8009 11.1831C12.9283 10.7607 12.9557 10.2299 12.9767 9.76902C13.0005 9.24689 13.0004 9.04027 13.0002 7.94749V7.94738L13.0001 7.50039L13.0001 7.05747C13.0004 5.96085 13.0005 5.75365 12.9766 5.23085C12.9556 4.76993 12.9282 4.23912 12.8009 3.81678C12.6735 3.39445 12.5001 3.06288 12.1173 2.71913C11.7345 2.37538 11.4172 2.27009 11.1056 2.17621C10.7813 2.07856 10.3511 2.04658 9.76571 2.01996C9.29421 1.99836 9.08194 1.99859 8.24092 1.99951H8.24092C8.0357 1.99974 7.79305 2.00001 7.50006 2.00001L7.05704 1.99993C5.96051 1.99964 5.75331 1.99958 5.23052 2.02343C4.7696 2.04446 4.23879 2.07183 3.81645 2.19921C3.39411 2.32659 3.06255 2.49999 2.7188 2.88281C2.37505 3.26562 2.26976 3.58286 2.17588 3.89453C2.07823 4.21874 2.04625 4.64894 2.01963 5.23437C1.99824 5.70131 1.99849 5.91401 1.99949 6.73496ZM7.49996 5.25015C6.25741 5.25015 5.25012 6.25744 5.25012 7.49999C5.25012 8.74254 6.25741 9.74983 7.49996 9.74983C8.74251 9.74983 9.7498 8.74254 9.7498 7.49999C9.7498 6.25744 8.74251 5.25015 7.49996 5.25015ZM4.25012 7.49999C4.25012 5.70515 5.70512 4.25015 7.49996 4.25015C9.2948 4.25015 10.7498 5.70515 10.7498 7.49999C10.7498 9.29483 9.2948 10.7498 7.49996 10.7498C5.70512 10.7498 4.25012 9.29483 4.25012 7.49999ZM10.9697 4.7803C11.3839 4.7803 11.7197 4.44452 11.7197 4.0303C11.7197 3.61609 11.3839 3.2803 10.9697 3.2803C10.5555 3.2803 10.2197 3.61609 10.2197 4.0303C10.2197 4.44452 10.5555 4.7803 10.9697 4.7803Z"
				fill="currentColor"
			></path>
		</svg>
	);
};
const CheckedIcon = () => {
	return (
		<svg
			className="peer-checked:block hidden h-5 w-5 text-[#617874]"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
				clipRule="evenodd"
			/>
		</svg>
	);
};
const CircleIcon = () => {
	return (
		<svg
			className="peer-checked:hidden block h-5 w-5 text-[#617874]"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704Z"
				fill="currentColor"
				fillRule="evenodd"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

function Example({ parallax, setActiveOffset }) {
	return (
		<div className="w-full bg-[#222615]  max-h-screen overflow-y-auto">
			<div className="relative">
				<p className="font-edwardian text-4xl text-[#F8F4EC] text-center pb-4 pt-2">
					Rsvp
				</p>
				<div className="w-full border-t border-[#F8F4EC]" />
				<p className="font-baskervville text-[#F8F4EC] text-center max-w-sm mx-auto mt-4 leading-4">
					We have reserved seat under your name. Due to limited space, we are
					unable to accommodate plus ones
				</p>
				<p className="font-baskervville text-[#F8F4EC] text-center max-w-md mx-auto mt-4 leading-4">
					We hope that you understand that we want to share this happy moment
					with you, our closest friends and family
				</p>
			</div>
			<FormComponent parallax={parallax} setActiveOffset={setActiveOffset} />
		</div>
	);
}
const initState = {
	name: "Tamu Undangan",
	ucapan:
		"We have reserved seat under your name. Due to limited space, we are unable to accommodate plus ones",
	attendance: "Hadir",
};

const duplicateCount = 5;

// Gunakan map untuk menduplikasi
const duplicatedStates = Array.from({ length: duplicateCount }).map(() => ({
	...initState,
}));

function FormComponent({ parallax, setActiveOffset }) {
	const [formData, setFormData] = useState(initState);

	const [submissions, setSubmissions] = useState(duplicatedStates);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formData.name || !formData.ucapan) {
			alert("Nama dan Ucapan wajib diisi!");
			return;
		}

		setSubmissions((prev) => [...prev, formData]);
		setFormData({ name: "", ucapan: "", attendance: "Hadir" }); // Reset form
	};

	return (
		<div className="max-w-lg mx-auto">
			<form onSubmit={handleSubmit}>
				{/* Nama */}
				<div className="px-3 mt-5">
					<label
						htmlFor="name"
						className="font-edwardian text-3xl text-[#F8F4EC] text-center pb-4 pt-2"
					>
						Nama
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="name"
							id="name"
							value={formData.name}
							onChange={handleChange}
							className="outline-none rounded-md w-full p-3 bg-[#F8F4EC]"
						/>
					</div>
				</div>

				{/* Ucapan & Doa */}
				<div className="px-3 mt-5">
					<label
						htmlFor="ucapan"
						className="font-edwardian text-3xl text-[#F8F4EC] text-center pb-4 pt-2"
					>
						Ucapan & Doa
					</label>
					<div className="mt-1">
						<textarea
							name="ucapan"
							id="ucapan"
							value={formData.ucapan}
							onChange={handleChange}
							rows="4"
							className="resize-none outline-none rounded-md w-full p-3 bg-[#F8F4EC]"
						/>
					</div>
				</div>

				{/* Kehadiran */}
				<div className="px-3 mt-5">
					<label className="font-edwardian text-3xl text-[#F8F4EC] text-center pb-4 pt-2">
						Kehadiran
					</label>
					<div className="mt-1">
						<div className="grid grid-cols-2 gap-4">
							<label className="rounded-full relative border py-2 px-4 flex items-center gap-x-2 w-full cursor-pointer focus:outline-none bg-[#F8F4EC]">
								<input
									type="radio"
									name="attendance"
									value="Hadir"
									checked={formData.attendance === "Hadir"}
									onChange={handleChange}
									className="sr-only peer"
								/>

								<CheckedIcon />
								<CircleIcon />
								<span className="mt-0.5 font-medium text-[#617874] font-baskervville text-[16px]">
									Hadir
								</span>
							</label>
							<label className="rounded-full relative border py-2 px-4 flex items-center gap-x-2 w-full cursor-pointer focus:outline-none bg-[#F8F4EC]">
								<input
									type="radio"
									name="attendance"
									value="Tidak Hadir"
									checked={formData.attendance === "Tidak Hadir"}
									onChange={handleChange}
									className="sr-only peer"
								/>

								<CheckedIcon />
								<CircleIcon />
								<span className="mt-0.5 font-medium text-[#617874] font-baskervville text-[16px]">
									Tidak Hadir
								</span>
							</label>
						</div>
					</div>
				</div>

				{/* Tombol Kirim */}
				<div className="px-3 mt-5">
					<button
						type="submit"
						className="w-full block rounded-full bg-[#F8F4EC] hover:bg-[#F8F4EC]/80 duration-300 px-8 py-2.5 font-medium text-[#617874] font-baskervville"
					>
						Kirim
					</button>
				</div>
			</form>

			<div
				onClick={() => {
					parallax.current.scrollTo(8);
					setActiveOffset(8);
				}}
				className="relative mt-10"
			>
				<p className="font-edwardian text-4xl text-[#F8F4EC] text-center pb-4 pt-2">
					Ucapan & Doa
				</p>
				<div className="w-full border-t border-[#F8F4EC] mb-5" />
				<div className="mt-8">
					{submissions?.reverse().map((submission, index) => (
						<div
							key={index}
							className="bg-[#52583E] px-4 py-2.5 m-1.5 rounded-md"
						>
							<p className="font-baskervville text-[#F8F4EC] text-center max-w-sm mx-auto leading-4">
								{submission.name}
							</p>
							<p className="font-baskervville text-[#F8F4EC] text-center max-w-sm mx-auto mt-2.5 leading-4">
								{submission.ucapan}
							</p>
						</div>
					))}
				</div>
			</div>
			{/* Mapping Hasil */}
		</div>
	);
}

function ExampleX() {
	return (
		<div className="flex flex-col items-center justify-center h-full relative w-full">
			<p className="font-baskervville text-[#F8F4EC] text-center max-w-[220px] mx-auto mt-2.5 leading-5">
				“The world is indeed full of peril, and in it there are many dark
				places; but still there is much that is fair, and though in all lands
				love is now mingled with grief, it grows perhaps the greater.”
				<br />
				<br /> -J.R.R. Tolkien
			</p>
			<div className="bg-[#222615] px-4 py-2.5 m-1.5 rounded-md flex items-center justify-between w-full absolute -bottom-2">
				<span className="font-baskervville text-[#F8F4EC]">
					Personally Made by
				</span>
				<img src="/assets/frame/logo-studio.png" className="h-14" />
			</div>
		</div>
	);
}

const colorOptions = [
	{ id: "1", label: "Texas Tea", color: "#d5c2b1" }, // Black
	{ id: "2", label: "Crimson", color: "#efe6df" }, // Red
	{ id: "3", label: "Sky Blue", color: "#867f6d" }, // Blue
	{ id: "4", label: "Forest Green", color: "#9e8571" }, // Green
	{ id: "5", label: "Forest Green", color: "#32312f" }, // Green
	// Add more colors here...
];

function ColorSelector() {
	return (
		<div className="flex flex-wrap gap-1 w-fit mx-auto">
			{colorOptions.map(({ id, label, color }) => (
				<label
					key={id}
					htmlFor={id}
					className="block size-8 cursor-pointer rounded-full shadow-sm"
					style={{
						backgroundColor: color,
						borderColor: color,
					}}
				>
					<input
						type="radio"
						name="ColorOption"
						value={id}
						id={id}
						className="sr-only"
						defaultChecked={id === "ColorBlack"}
					/>
					<span className="sr-only">{label}</span>
				</label>
			))}
		</div>
	);
}
