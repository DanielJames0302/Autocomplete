import { useCallback, useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import {
  autoUpdate,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { IoIosClose } from "react-icons/io";


interface AutocompleteProps {
  description?: string;
  disabled?: boolean;
  filterOptions?: (options: any[], inputValue: string) => any[];
  label?: string;
  loading?: boolean;
  multiple?: boolean;
  onChange?: (newValues: any[]) => void;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options?: any[];
  placeholder?: string;
  renderOption?: (option: any, highlightOption: number, index: number) => React.ReactNode;
  value?: any[];
  isSync?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  description = "",
  disabled = false,
  filterOptions,
  label = "",
  loading = false,
  multiple = false,
  onChange = (newValues: any[]) => {},
  onInputChange,
  options = [],
  placeholder = "",
  renderOption,
  value = [],
}) => {
  const { refs, floatingStyles } = useFloating({
    placement: "bottom",

    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      shift(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });
  const [isOpenOptions, setIsOpenOptions] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchResults, setSearchResult] = useState<any>([]);
  const componentRef = useRef<HTMLInputElement>(null);
  const [highlightOption, setHighlightOption] = useState<number>(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const defaultFilterOptions = useCallback(
    (options: any[], inputValue: string) => {
      if (typeof options[0] === "string") {
        return options.filter((option) =>
          (option as string).toLowerCase().includes(inputValue.toLowerCase())
        );
      } else {
        return options.filter((option?) =>
          (option as { label: string }).label
            .toLowerCase()
            .includes(inputValue.toLowerCase())
        );
      }
    },
    []
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (loading) return;
      setHighlightOption(-1);
      setInputValue(event.target.value);
      if (onInputChange) onInputChange(event);
      const filteredOptions =
        filterOptions !== undefined
          ? filterOptions(options, event.target.value)
          : defaultFilterOptions(options, event.target.value);

      setSearchResult(filteredOptions);
    },
    [
      onInputChange,
      setSearchResult,
      filterOptions,
      options,
      defaultFilterOptions,
      inputValue,
      loading,
    ]
  );

  const handleChooseOption = useCallback(
    (option: any) => {
      if (multiple) {
        const newValue = value.includes(option)
          ? value.filter((selected) => selected !== option)
          : [...value, option];
        onChange(newValue);
      } else {
        if (value.includes(option)) onChange([]);
        else onChange([option]);
      }
    },
    [multiple, onChange, value]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const currentLength =
        inputValue === "" ? options.length : searchResults.length;
      switch (event.key) {
        case "ArrowDown":
          setHighlightOption((prevIndex) =>
            prevIndex === currentLength - 1 ? 0 : prevIndex + 1
          );
          break;
        case "ArrowUp":
          setHighlightOption((prevIndex) =>
            prevIndex <= 0 ? currentLength - 1 : prevIndex - 1
          );
          break;
        case "Enter":
          if (highlightOption >= 0) {
            if (inputValue === "") handleChooseOption(options[highlightOption]);
            else handleChooseOption(searchResults[highlightOption]);
          }
          break;
        case "Escape":
          setHighlightOption(-1);
          setIsOpenOptions(false);
          break;
        default:
          break;
      }
    },
    [handleChooseOption, highlightOption, searchResults, options, inputValue]
  );

  const defaultRenderOption = (option: any,highlightOption: number, index: number) => {
    return (
      <div className={`h-10 flex flex-row justify-between items-center p-3 hover:bg-blue-300  ${
                    highlightOption === index ? "bg-blue-300" : ""
                  }`}>
        <div className="mr">
          {typeof option === "string" ? option : option.label}
        </div>
        <input
          className="w-6 h-6 checked:bg-blue-600  checked:ring-blue-500"
          checked={value.includes(option)}
          type="checkbox"
          onChange={() => handleChooseOption(option)}
        />
      </div>
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !event.composedPath().includes(componentRef.current)
      ) {
        setIsOpenOptions(false);
        return;
      }
      setIsOpenOptions(true);
    };

    document.body.addEventListener("click", handleOutsideClick);
    return () => document.body.removeEventListener("click", handleOutsideClick);
  }, [isOpenOptions, setIsOpenOptions]);

  useEffect(() => {
    if (highlightOption >= 0 && resultsRef.current) {
      const item = resultsRef.current.children[highlightOption] as HTMLElement;
      item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightOption]);

  return (
    <div
      ref={componentRef}
      className="flex flex-col items-center justify-center h-auto gap-2"
    >
      <div className="w-full text-start text-gray-600 font-light text-wrap ">{label}</div>
      <div
        ref={refs.setReference}
        className="relative w-full shadow-lg bg-gray-50 p-2 flex flex-row flex-wrap items-center justify-start gap-2 disabled:opacity-75 rounded-lg has-[:focus]:ring-2 has-[:focus]:ring-blue-500"
      >
        <div className="">
          <IoSearchSharp />
        </div>
        {
          value.map((val: any, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center bg-blue-100 text-blue-700 rounded p-2"
            >
              <span>{typeof val === "string" ? val : val.label}</span>
              <button
                onClick={() => handleChooseOption(val)}
                className="ml-1 text-blue-500"
              >
                <IoIosClose />
              </button>
            </div>
          ))}

        <input
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          type="text"
          placeholder={placeholder}
          className=" text-gray-900 bg-gray-50 flex-grow text-sm foucs:outline-none border-none focus:border-none focus:ring-0 disabled:opacity-7 "
        />
        <div className="w-5 flex items-center justify-center">
          {loading && (
            <div role="status" className="">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
      {isOpenOptions && !loading && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="menu rounded-md shadow-lg bg-white z-50"
        >
          <div
            ref={resultsRef}
            className="flex flex-col h-auto max-h-[200px] overflow-auto overflow-x-auto"
          >
            {inputValue === "" ? (
              options.map((option, index) => (
                <div
                  className=""
                  onClick={() => handleChooseOption(option)}
                  key={index}
                >
                   {renderOption
                    ? renderOption(option, highlightOption, index)
                    : defaultRenderOption(option, highlightOption, index)}
                </div>
              ))
            ) : searchResults.length === 0 ? (
              <div className="p-2 even:bg-slate-200">No results were found</div>
            ) : (
              searchResults.map((option: any, index: number) => (
                <div
                  className=""
                  onClick={() => handleChooseOption(option)}
                  key={index}
                >
                  {renderOption
                    ? renderOption(option, highlightOption, index)
                    : defaultRenderOption(option, highlightOption, index)}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="text-start text-gray-600 font-light flex-wrap">
        {description}
      </div>
    </div>
  );
};

export default Autocomplete;
