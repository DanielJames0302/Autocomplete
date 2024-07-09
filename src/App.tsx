import { useCallback, useEffect, useRef, useState } from "react";
import Autocomplete from "./components/Autocomplete";
import { countries } from "./components/countries";

function App() {
  const [inputValue, setInputValue] = useState("");

  const [valueAsync, setValueAsync] = useState<any[]>([]);
  const [valueSync, setValueSync] = useState<any[]>()
  const handleChangeValue = (newValue: any) => {
    setValueSync(newValue);
  };
  const [loading, setLoading] = useState(false);
  const typingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    setLoading(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, [inputValue]);

  const customFilterOptions = useCallback(
    (options: any[], inputValue: string) => {
 
        return options.filter((option?) =>
          option.code.toLowerCase().includes(inputValue.toLowerCase())
        );
      
    },
    []
  );
  return (
    <div className="bg-slate-100 h-screen flex items-center justify-center">
      <div className="h-auto p-6 bg-white p-10px flex flex-col items-start justify-start gap-3 w-1/4">
        <Autocomplete
          description="With description and custom display"
          label="Async search"
          options={countries}
          value={valueAsync}
          loading={loading}
          onInputChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(event?.target.value)
          }
          onChange={(newValue) => setValueAsync(newValue)}
          placeholder="Type to begin searching"
          renderOption={(option, highlightOption, index) => (
            <div
              className={`h-10 flex flex-row justify-between items-center p-3 hover:bg-blue-300 bg-slate-200 ${
                highlightOption === index ? "bg-blue-500" : ""
              }`}
            >
              <div className="">{option.label}</div>
              <div>{option.code}</div>
            </div>
          )}
          filterOptions={customFilterOptions}
        />

        <Autocomplete
          description="With default display and search on focus"
          multiple={true}
          label="Sync search"
          options={countries}
          value={valueSync}
          onChange={(newValue) => setValueSync(newValue)}
          placeholder="Type to begin searching"
         
        />
      </div>
    </div>
  );
}

export default App;
