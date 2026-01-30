import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface EditorPanelProps {
      selectedElement: {
            tagName: string;
            className: string;
            text: string;
            styles: {
                  padding: string;
                  margin: string;
                  color: string;
                  backgroundColor: string;
                  fontSize: string;
            };
      } | null;
      onUpdate: (updates: any) => void;
      onClose: () => void;
}

const EditorPanel = ({ selectedElement, onUpdate, onClose }: EditorPanelProps) => {

      const [values, setValues] = useState(selectedElement);

      useEffect(() => {
            setValues(selectedElement);
      }, [selectedElement]);

      if (!selectedElement || !values) {
            return null;
      }

      const handleChange = (field: string, value: string) => {
            const newValues = { ...values, [field]: value }
            if (field in values.styles) {
                  newValues.styles = { ...values.styles, [field]: value }
            }
            setValues(newValues);
            onUpdate({ [field]: value });
      }

      const handleStyleChange = (styleName: string, value: string) => {
            const newStyles = { ...values.styles, [styleName]: value };
            setValues({ ...values, styles: newStyles });
            onUpdate({ styles: { [styleName]: value } });
      }

      return (
            <>
                  <div className="absolute top-4 right-4 w-80 bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-white/10 p-5 z-50 animate-fade-in fade-in ring-1 ring-white/5">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700/50 pb-4">
                              <h3 className="font-bold text-gray-100 text-lg tracking-tight">
                                    Edit Element
                              </h3>
                              <button
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-white/10 rounded-full transition-all duration-200 hover:rotate-90 active:scale-95"
                              >
                                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                              </button>
                        </div>

                        {/* Form Content */}
                        <div className="space-y-5">

                              {/* Text Area */}
                              <div>
                                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5 ml-1">
                                          Text Content
                                    </label>
                                    <textarea
                                          value={values.text}
                                          onChange={(e) => handleChange('text', e.target.value)}
                                          className="w-full text-sm p-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all duration-200 min-h-24 resize-none shadow-inner text-gray-200 placeholder-gray-600"
                                    />
                              </div>

                              {/* Class Name */}
                              <div>
                                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5 ml-1">
                                          Class Name
                                    </label>
                                    <input
                                          type="text"
                                          value={values.className || ""}
                                          onChange={(e) => handleChange('className', e.target.value)}
                                          className="w-full text-sm p-2.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all duration-200 shadow-inner text-gray-200"
                                    />
                              </div>

                              {/* Grid 1: Spacing */}
                              <div className="grid grid-cols-2 gap-4">
                                    <div>
                                          <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5 ml-1">
                                                Padding
                                          </label>
                                          <input
                                                type="text"
                                                value={values.styles.padding}
                                                onChange={(e) => handleStyleChange('padding', e.target.value)}
                                                className="w-full text-sm p-2.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all duration-200 shadow-inner text-gray-200 text-center"
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5 ml-1">
                                                Margin
                                          </label>
                                          <input
                                                type="text"
                                                value={values.styles.margin}
                                                onChange={(e) => handleStyleChange('margin', e.target.value)}
                                                className="w-full text-sm p-2.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all duration-200 shadow-inner text-gray-200 text-center"
                                          />
                                    </div>
                              </div>

                              {/* Grid 2: Font Size */}
                              <div className="grid grid-cols-2 gap-4">
                                    <div>
                                          <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5 ml-1">
                                                Font Size
                                          </label>
                                          <input
                                                type="text"
                                                value={values.styles.fontSize}
                                                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                                className="w-full text-sm p-2.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all duration-200 shadow-inner text-gray-200 text-center"
                                          />
                                    </div>
                              </div>

                              {/* Grid 3: Colors */}
                              <div className="grid grid-cols-2 gap-4">
                                    {/* Background Color Picker */}
                                    <div>
                                          <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5 ml-1">
                                                Background
                                          </label>
                                          <div className="flex items-center gap-2 border border-gray-700 bg-gray-900/50 rounded-xl p-1.5 shadow-sm hover:border-indigo-500/50 transition-colors cursor-pointer group">
                                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-600 shadow-sm">
                                                      <input
                                                            type="color"
                                                            value={values.styles.backgroundColor === 'rgba(0,0,0,0)' ? '#ffffff' : values.styles.backgroundColor}
                                                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                                            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0"
                                                      />
                                                </div>
                                                <span className="text-xs text-gray-300 font-mono truncate group-hover:text-indigo-400 transition-colors">
                                                      {values.styles.backgroundColor}
                                                </span>
                                          </div>
                                    </div>

                                    {/* Text Color Picker */}
                                    <div>
                                          <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5 ml-1">
                                                Text Color
                                          </label>
                                          <div className="flex items-center gap-2 border border-gray-700 bg-gray-900/50 rounded-xl p-1.5 shadow-sm hover:border-indigo-500/50 transition-colors cursor-pointer group">
                                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-600 shadow-sm">
                                                      <input
                                                            type="color"
                                                            value={values.styles.color === 'rgba(0,0,0,0)' ? '#ffffff' : values.styles.color}
                                                            onChange={(e) => handleStyleChange('color', e.target.value)}
                                                            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0"
                                                      />
                                                </div>
                                                <span className="text-xs text-gray-300 font-mono truncate group-hover:text-indigo-400 transition-colors">
                                                      {values.styles.color}
                                                </span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </>
      )
}

export default EditorPanel