import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Animated,
	LayoutChangeEvent,
	ListRenderItem,
	NativeScrollEvent,
	NativeSyntheticEvent,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from "react-native";
import { PaginationDots } from "./PaginationDots";

interface CarouselProps<T> {
	data: T[];
	renderItem: ListRenderItem<T>;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	autoplay?: boolean;
	autoplayInterval?: number;
	dotsVisible?: boolean;
	slideCentered?: boolean;
	freeSlide?: boolean;
	loop?: boolean;
	style?: StyleProp<ViewStyle>;
	itemWidth?: number;
	gap?: number;
}

function Carousel<T>({
	data,
	renderItem,
	header,
	footer,
	autoplay = false,
	autoplayInterval = 3000,
	dotsVisible = true,
	slideCentered = false,
	freeSlide = false,
	loop = false,
	style,
	itemWidth,
	gap = 16,
}: CarouselProps<T>) {
	const [containerWidth, setContainerWidth] = useState(0);

	const calculatedWidth =
		containerWidth > 0
			? containerWidth - (slideCentered ? gap * 2 : gap)
			: 0;

	const activeWidth =
		itemWidth || (calculatedWidth > 0 ? calculatedWidth : 0);

	const totalItemWidth = activeWidth + gap;

	const scrollX = useRef(new Animated.Value(0)).current;
	const flatListRef = useRef<Animated.FlatList<T>>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const isAutoplayEnabled = freeSlide ? false : autoplay;
	const areDotsVisible = freeSlide ? false : dotsVisible;
	const isPagingEnabled = freeSlide ? false : true;

	const snapAlignment = freeSlide
		? undefined
		: slideCentered
			? "start"
			: "start";

	const onLayout = (event: LayoutChangeEvent) => {
		const { width } = event.nativeEvent.layout;
		if (width && width !== containerWidth) {
			setContainerWidth(width);
		}
	};

	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;

		if (isAutoplayEnabled && data.length > 0 && totalItemWidth > 0) {
			interval = setInterval(() => {
				let nextIndex = activeIndex + 1;

				if (nextIndex >= data.length) {
					if (loop) {
						nextIndex = 0;
					} else {
						clearInterval(interval);
						return;
					}
				}

				flatListRef.current?.scrollToOffset({
					offset: nextIndex * totalItemWidth,
					animated: true,
				});
				setActiveIndex(nextIndex);
			}, autoplayInterval);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [
		activeIndex,
		isAutoplayEnabled,
		data.length,
		loop,
		autoplayInterval,
		totalItemWidth,
	]);

	const onMomentumScrollEnd = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const position = event.nativeEvent.contentOffset.x;
			if (totalItemWidth > 0) {
				const index = Math.round(position / totalItemWidth);
				setActiveIndex(index);
			}
		},
		[totalItemWidth],
	);

	const onScrollToIndexFailed = (info: { index: number }) => {
		const wait = new Promise((resolve) => setTimeout(resolve, 500));
		wait.then(() => {
			flatListRef.current?.scrollToOffset({
				offset: info.index * totalItemWidth,
				animated: true,
			});
		});
	};

	if (activeWidth <= 0) {
		return <View style={[styles.container, style]} onLayout={onLayout} />;
	}

	const sidePadding = (containerWidth - activeWidth) / 2;

	return (
		<View style={[styles.container, style]} onLayout={onLayout}>
			{header && <View style={styles.headerContainer}>{header}</View>}

			<Animated.FlatList<any>
				ref={flatListRef}
				data={data}
				renderItem={({ item, index }) => {
					const isLastItem = index === data.length - 1;

					return (
						<View
							style={{
								width: activeWidth,
								marginRight: isLastItem ? 0 : gap,
								overflow: "visible",
							}}>
							{renderItem({ item, index } as any)}
						</View>
					);
				}}
				keyExtractor={(_, index) => index.toString()}
				horizontal
				showsHorizontalScrollIndicator={false}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { x: scrollX } } }],
					{ useNativeDriver: false },
				)}
				scrollEventThrottle={16}
				pagingEnabled={false}
				snapToInterval={freeSlide ? undefined : totalItemWidth}
				snapToAlignment={snapAlignment}
				decelerationRate={freeSlide ? "normal" : "fast"}
				onMomentumScrollEnd={onMomentumScrollEnd}
				onScrollToIndexFailed={onScrollToIndexFailed}
				removeClippedSubviews={false}
				contentContainerStyle={{
					paddingHorizontal:
						slideCentered && !freeSlide ? sidePadding : undefined,
					paddingBottom: 8,
				}}
			/>

			{areDotsVisible && (
				<PaginationDots
					data={data}
					scrollX={scrollX}
					screenWidth={totalItemWidth}
				/>
			)}

			{footer && <View style={styles.footerContainer}>{footer}</View>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		overflow: "visible",
	},
	headerContainer: {
		marginBottom: 10,
	},
	footerContainer: {
		marginTop: 10,
	},
});

export default Carousel;
