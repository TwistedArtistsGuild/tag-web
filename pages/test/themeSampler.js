/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Image from "next/image"
import ThemeSwitcher from "@/components/Header/ThemeSwitcher"
import { useLayout } from "@/components/LayoutProvider"

const themes = [
  "tag-theme",
  "neon",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "valentine",
  "halloween",
  "garden",
  "aqua",
  "pastel",
  "fantasy",
  "black",
  "luxury",
  "dracula",
]

const ThemeSampler = () => {
  const { theme, updateTheme } = useLayout()

  return (
    <div className="p-8 min-h-screen bg-base-200 text-base-content">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">daisyUI Theme Sampler</h1>

        <div className="mb-8 flex flex-col items-center">
          <ThemeSwitcher themes={themes} currentTheme={theme} onThemeChange={updateTheme} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buttons */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Buttons</h2>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-accent">Accent</button>
                <button className="btn btn-info">Info</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-error">Error</button>
                <button className="btn btn-ghost">Ghost</button>
                <button className="btn btn-link">Link</button>
                <button className="btn btn-outline">Outline</button>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Alerts</h2>
              <div className="alert alert-info">
                <span>New software update available.</span>
              </div>
              <div className="alert alert-success">
                <span>Your purchase has been confirmed!</span>
              </div>
              <div className="alert alert-warning">
                <span>Warning: Invalid email address!</span>
              </div>
              <div className="alert alert-error">
                <span>Error! Task failed successfully.</span>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="card bg-base-100 shadow-xl">
            <figure className="relative h-48 w-full overflow-hidden">
              <Image src="/placeholder.svg?height=200&width=400" alt="Abstract pattern" fill style={{ objectFit: 'cover' }} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                Card title!
                <div className="badge badge-secondary">NEW</div>
              </h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div className="card-actions justify-end">
                <div className="badge badge-outline">Fashion</div>
                <div className="badge badge-outline">Products</div>
              </div>
            </div>
          </div>

          {/* Inputs & Forms */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Inputs & Forms</h2>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Your name</span>
                </label>
                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Remember me</span>
                  <input type="checkbox" className="checkbox checkbox-primary" />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Toggle switch</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Radio option 1</span>
                  <input type="radio" name="radio-1" className="radio radio-primary" checked />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Radio option 2</span>
                  <input type="radio" name="radio-1" className="radio radio-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* Progress & Badges */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Progress & Badges</h2>
              <progress className="progress progress-primary w-full" value="70" max="100"></progress>
              <progress className="progress progress-secondary w-full" value="40" max="100"></progress>
              <progress className="progress progress-accent w-full" value="10" max="100"></progress>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="badge badge-primary">Primary</div>
                <div className="badge badge-secondary">Secondary</div>
                <div className="badge badge-accent">Accent</div>
                <div className="badge badge-info">Info</div>
                <div className="badge badge-success">Success</div>
                <div className="badge badge-warning">Warning</div>
                <div className="badge badge-error">Error</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Tabs</h2>
              <div role="tablist" className="tabs tabs-boxed">
                <a role="tab" className="tab tab-active">
                  Tab 1
                </a>
                <a role="tab" className="tab">
                  Tab 2
                </a>
                <a role="tab" className="tab">
                  Tab 3
                </a>
              </div>
              <div role="tablist" className="tabs tabs-lifted">
                <a role="tab" className="tab">
                  Tab 1
                </a>
                <a role="tab" className="tab tab-active">
                  Tab 2
                </a>
                <a role="tab" className="tab">
                  Tab 3
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSampler

