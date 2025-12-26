import React from "react";
import { useNavigate } from "react-router-dom";
import { userRoute } from "../../routes/RouteUser";
import { searchIcon } from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";

interface ISearchBar {
  setSearch?: (val: string) => void;
  disableSearch: boolean;
}

const SearchBar: React.FC<ISearchBar> = ({ setSearch, disableSearch }) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();

  return (
    <div
      className="search-container cursor"
      onClick={() => disableSearch && navigate(userRoute.search)}
    >
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          {searchIcon}
        </span>
        <input
          type="search"
          name="search"
          autoFocus={!disableSearch}
          className="py-2 h-10 w-full text-sm focus:outline-none rounded-md pl-10 pr-2 bg-white comman-grey !text-[16px]"
          placeholder={t("search_here")}
          onChange={(e) => setSearch && setSearch(e.target.value.trim())}
        />
      </div>
    </div>
  );
};

export default SearchBar;
