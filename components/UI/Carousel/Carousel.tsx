import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	Animated,
	LayoutChangeEvent,
	ListRenderItem,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Platform,
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
	dotsVisible = false,
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

	const activeIndexRef = useRef(0);
	const scrollX = useRef(new Animated.Value(0)).current;
	const flatListRef = useRef<Animated.FlatList<T>>(null);

	const isAutoplayEnabled = freeSlide ? false : autoplay;
	const areDotsVisible = freeSlide ? false : dotsVisible;

	const snapAlignment = freeSlide ? undefined : "start";

	const onLayout = useCallback(
		(event: LayoutChangeEvent) => {
			const { width } = event.nativeEvent.layout;
			if (width && Math.abs(width - containerWidth) > 1) {
				setContainerWidth(width);
			}
		},
		[containerWidth],
	);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;

		if (isAutoplayEnabled && data.length > 0 && totalItemWidth > 0) {
			interval = setInterval(() => {
				let nextIndex = activeIndexRef.current + 1;

				if (nextIndex >= data.length) {
					if (loop) {
						nextIndex = 0;
					} else {
						clearInterval(interval);
						return;
					}
				}

				activeIndexRef.current = nextIndex;
				flatListRef.current?.scrollToOffset({
					offset: nextIndex * totalItemWidth,
					animated: true,
				});
			}, autoplayInterval);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [
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
				activeIndexRef.current = Math.round(position / totalItemWidth);
			}
		},
		[totalItemWidth],
	);

	const onScrollToIndexFailed = useCallback(
		(info: { index: number }) => {
			setTimeout(() => {
				flatListRef.current?.scrollToOffset({
					offset: info.index * totalItemWidth,
					animated: true,
				});
			}, 500);
		},
		[totalItemWidth],
	);

	const renderCarouselItem = useCallback(
		({ item, index }: any) => {
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
		},
		[activeWidth, gap, data.length, renderItem],
	);

	const handleScroll = useMemo(
		() =>
			Animated.event(
				[{ nativeEvent: { contentOffset: { x: scrollX } } }],
				{ useNativeDriver: false },
			),
		[scrollX],
	);

	const contentContainerStyle = useMemo(
		() => ({
			paddingHorizontal:
				slideCentered && !freeSlide
					? (containerWidth - activeWidth) / 2
					: gap,
			paddingBottom: 8,
		}),
		[slideCentered, freeSlide, containerWidth, activeWidth, gap],
	);

	if (activeWidth <= 0) {
		return <View style={[styles.container, style]} onLayout={onLayout} />;
	}

	return (
		<View style={[styles.container, style]} onLayout={onLayout}>
			{header && <View style={styles.headerContainer}>{header}</View>}

			<Animated.FlatList<any>
				ref={flatListRef}
				data={data}
				renderItem={renderCarouselItem}
				keyExtractor={(_, index) => index.toString()}
				horizontal
				showsHorizontalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				pagingEnabled={false}
				snapToInterval={freeSlide ? undefined : totalItemWidth}
				snapToAlignment={snapAlignment}
				decelerationRate={freeSlide ? "normal" : "fast"}
				onMomentumScrollEnd={onMomentumScrollEnd}
				onScrollToIndexFailed={onScrollToIndexFailed}
				initialNumToRender={3}
				maxToRenderPerBatch={3}
				windowSize={5}
				removeClippedSubviews={Platform.OS === "android"}
				contentContainerStyle={contentContainerStyle}
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

export default React.memo(Carousel) as typeof Carousel;
