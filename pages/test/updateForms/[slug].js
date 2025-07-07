/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import DynaFormDB from '/components/widgets/DynaFormDB';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import 'daisyui';

/**
 * Page component for updating form metadata and fields.
 *
 * Props:
 *  - metadataProp: the metadata object for the current form (with fields loaded)
 *  - FormStructure_metadata: metadata that defines the form structure
 *  - formNames: an array of form names
 *  - slug: the form slug used for routing
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
export default function UpdateFormsForm1(props) {
  const router = useRouter();
  const [selectedForm, setSelectedForm] = useState('');
  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;

  // Filter out "UpdateFormsMeta" and "UpdateFormsFields" from the dropdown options
  const filteredFormNames = props.formNames.filter(
    (formName) => formName !== 'UpdateFormsMeta' && formName !== 'UpdateFormsFields'
  );

  // Build URL properties on the metadata object
  // (Ensure that the property keys match what your API provides.)
  props.metadataProp.FromURL = `/test/updateForms`;
  props.metadataProp.redirectURL = `/test/updateForms/${props.slug}`;
  props.metadataProp.APIURL =
    api_url + `${props.metadataProp.apiurLpostfix}/${props.metadataProp.name}`;

  // For the form structure metadata used for designing/updating the form
  props.FormStructure_metadata.FromURL = `/test/updateForms`;
  props.FormStructure_metadata.redirectURL = `/test/updateForms/${props.slug}`;
  props.FormStructure_metadata.APIURL =
    api_url +
    `${props.FormStructure_metadata.apiurLpostfix}/${props.FormStructure_metadata.name}`;

  return (
    <div>
      <div>
        <h2 className="text-lg font-bold mb-4">Available Forms</h2>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Select a form to edit:</span>
          </label>
          <select
            className="select select-bordered"
            value={selectedForm}
            onChange={(e) => {
              setSelectedForm(e.target.value);
              router.push(`/test/updateForms/${e.target.value}`);
            }}
          >
            <option value="" disabled>Select a form</option>
            {filteredFormNames.map((formName, index) => (
              <option key={index} value={formName}>{formName}</option>
            ))}
          </select>
        </div>
      </div>

      <h2 className="text-lg font-bold mt-6">Here is the Current Form, for reference.</h2>
      {/* Render the current form metadata and its fields */}
      <DynaFormDB
        metadataProp={props.metadataProp}
        fieldsProp={props.metadataProp.forms_Fields}
      />

	  <h2 className="text-lg font-bold mt-6">Here you may edit the metadata of the above form:</h2>
	  <DynaFormDB
              metadataProp={props.FormStructure_metadata}
              fieldsProp={props.FormStructure_metadata.forms_Fields}
              formData={props.metadataProp}
              displayHeaders={false}
            />

      <h2 className="text-lg font-bold mt-6">Here are the fields to be edited.</h2>
	  <ul>
        {/* Render each form field separately using the form structure */}
        {props.metadataProp.forms_Fields.map((field, index) => (
          <li key={index} className="mb-4">
            <DynaFormDB
              metadataProp={props.FormStructure_field}
              fieldsProp={props.FormStructure_field.forms_Fields}
              formData={props.fieldsProp}
              displayHeaders={false}
            />
          </li>
        ))}
      </ul>
	  <ul>
        <div className="text-lg font-bold mt-6">Create a new form field:</div>
        {/* Set the requestType to "add" */}
        {props.FormStructure_metadata.requestType = "add"}
        <DynaFormDB
          metadataProp={props.FormStructure_metadata}
          fieldsProp={props.FormStructure_metadata.forms_Fields}
          displayHeaders={false}
        />
      </ul>
    </div>
  );
}

/**
 * Custom getInitialProps to fetch the metadata and structure configuration.
 * This implementation extracts the first element from the API array, so that
 * the component receives a single metadata object.
 *
 * @param {Object} context - Next.js context object with query parameters.
 * @returns {Object} props for the component.
 */
UpdateFormsForm1.getInitialProps = async function (context) {
  const { slug } = context.query;
  if (!slug) {
    return {
      error: { message: 'Update Form: form slug is missing from context query' },
    };
  }

  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;

  try {
    // Fetch metadata for the specified form slug.
    const metadataRes = await fetch(`${api_url}forms_metadata/${slug}`);
    const metadataArray = await metadataRes.json();
    // Extract the first element from the returned array.
    const metadata = Array.isArray(metadataArray) ? metadataArray[0] : metadataArray;
    console.log('MetadataProp from API:', metadata);

    // Fetch the metadata that defines the form structure.
    const formStructureRes = await fetch(`${api_url}forms_metadata/UpdateFormsMeta`);
    const FormStructure_metadata = await formStructureRes.json();
    console.log('FormStructure_Metadata from API:', FormStructure_metadata);

	// Fetch the metadata that defines the form structure.
	const FormStructure_fieldRes = await fetch(`${api_url}forms_metadata/UpdateFormsFields`);
	const FormStructure_field = await FormStructure_fieldRes.json();
	console.log('FormStructure_field from API:', FormStructure_field);

    // Fetch list of available form names.
    const formNamesRes = await fetch(`${api_url}forms_metadata/listOfForms`);
    const formNames = await formNamesRes.json();

    return {
      metadataProp: metadata,
      FormStructure_metadata: FormStructure_metadata,
	  FormStructure_field: FormStructure_field,
      formNames: formNames,
      slug: slug,
    };
  } catch (error) {
    console.error('Error fetching form meta or field data:', error);
    return {
      metadataProp: {},
      FormStructure_metadata: {},
	  FormStructure_field: {},
      formNames: [],
      slug: slug,
    };
  }
};
