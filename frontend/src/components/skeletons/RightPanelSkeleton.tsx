const RightPanelSkeleton = () => {
	return (
		<div className='flex flex-col gap-2 w-full my-2'>
			<div className='flex gap-2 items-center'>
				<div className='skeleton w-10 h-10 rounded-full shrink-0'></div>
				<div className='flex flex-1 h-full items-center justify-between'>
					<div className='flex flex-col gap-1'>
						<div className='skeleton h-4 w-24 rounded-full'></div>
						<div className='skeleton h-3 w-16 rounded-full'></div>
					</div>
					<div className='skeleton h-full w-20 rounded-full'></div>
				</div>
			</div>
		</div>
	);
};
export default RightPanelSkeleton;