import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({ 
  id, 
  value, 
  onChange, 
  disabled, 
  placeholder, 
  autoComplete,
  required = true,
  minLength = 8
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const hasValue = value?.length > 0;
  const isValid = hasValue && value.length >= minLength;
  const showRequirements = isFocused || hasValue;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          className={`pr-10 transition-all ${
            isValid ? "border-green-500" : hasValue ? "border-red-500" : ""
          }`}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      {showRequirements && (
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li className={value?.length >= minLength ? "text-green-500" : ""}>
            • At least {minLength} characters
          </li>
        </ul>
      )}
    </div>
  );
};