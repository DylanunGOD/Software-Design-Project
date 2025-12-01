import React from 'react';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';
import ProfileButton from './ProfileButton';
import LocationButton from './LocationButton';

const MapOverlay = ({ 
  onSearch, 
  onSelectResult, 
  onFilterClick, 
  onProfileClick, 
  onLocationClick,
  filterActive 
}) => {
  return (
    <>
      {/* Search Bar - Top */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <SearchBar 
          onSearch={onSearch}
          onSelectResult={onSelectResult}
        />
      </div>

      {/* Right Controls */}
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-3">
        <ProfileButton onClick={onProfileClick} />
        <FilterButton onClick={onFilterClick} isActive={filterActive} />
        <LocationButton onClick={onLocationClick} />
      </div>
    </>
  );
};

export default MapOverlay;
