import { useEffect, useState } from "react";

interface Props {
	triggerRef: React.RefObject<HTMLDivElement>;
	loadMore: () => void;
	shouldLoadMore: boolean;
}

export const useInfiniteScroll = ({ triggerRef, loadMore, shouldLoadMore }: Props) => {
	useEffect(() => {
        if (!triggerRef.current) return;
    
        const options = {
          root: null,
          rootMargin: "0px",
          threshold: 0.1, // Change this threshold as needed.
        };
    
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            // Load more when the top is in view.
            if (shouldLoadMore) {
              loadMore();
            }
          }
        }, options);
    
        observer.observe(triggerRef.current);
    
        return () => {
          observer.disconnect();
        };
      }, [triggerRef, loadMore, shouldLoadMore]);
};
