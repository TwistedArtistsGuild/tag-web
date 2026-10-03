/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import DynaFormDB from '@/components/widgets/DynaFormDB';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import serverFetch from "@/libs/serverFetch"
import TagSEO from "@/components/TagSEO"

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
  const [selectedForm, setSelectedForm] = useState(props.slug || '');

  const mapFieldToEditorData = (field) => ({
    Forms_FieldID: field?.forms_FieldID,
    Forms_MetadataID: field?.forms_MetadataID,
    Name: field?.name ?? "",
    Type: field?.type ?? "",
    Placeholder: field?.placeholder ?? "",
    Label: field?.label ?? "",
    DefaultValue: field?.defaultValue ?? "",
    ClassName: field?.className ?? "",
    Width: field?.width ?? "",
    Height: field?.height ?? "",
    RegexValidationPattern: field?.regexValidationPattern ?? "",
    FieldOrder: field?.fieldOrder ?? "",
    IsRequired: field?.isRequired ?? false,
    IsReadOnly: field?.isReadOnly ?? false,
    Min: field?.min ?? "",
    Max: field?.max ?? "",
  })

  const mapMetadataToEditorData = (metadataRecord) => ({
    Forms_MetadataID: metadataRecord?.forms_MetadataID,
    name: metadataRecord?.name ?? "",
    Name: metadataRecord?.name ?? "",
    APIURLpostfix: metadataRecord?.apiurLpostfix ?? metadataRecord?.apiurlpostfix ?? metadataRecord?.APIURLpostfix ?? "",
    RequestType: metadataRecord?.requestType ?? "",
    SegmentationType: metadataRecord?.segmentationType ?? "",
    FormBody: metadataRecord?.formBody ?? "",
    FormStyle: metadataRecord?.formStyle ?? "",
    H1: metadataRecord?.h1 ?? "",
    H2: metadataRecord?.h2 ?? "",
    H3: metadataRecord?.h3 ?? "",
  })

  // If there's an error loading the form data, show error message
  if (props.error) {
    return (
      <div>
        <TagSEO metadataProp={{ title: "Error Loading Form", description: "Error loading form data.", keywords: "error", og: { title: "Error", description: "Error loading form data." } }} canonicalSlug="/github_projects/tag/tag-web/pages/test/updateForms/[slug]" />
        <div className="alert alert-error shadow-lg">
          <div>
            <span>Failed to load form: {props.error}</span>
          </div>
        </div>
        <button className="btn btn-primary mt-4" onClick={() => router.push('/test/updateForms')}>
          Back to Forms
        </button>
      </div>
    );
  }

  // Filter out "UpdateFormsMeta" and "UpdateFormsFields" from the dropdown options
  const filteredFormNames = Array.isArray(props.formNames)
    ? props.formNames.filter(
        (formName) => formName !== 'UpdateFormsMeta' && formName !== 'UpdateFormsFields'
      )
    : [];

  // Build URL properties on the metadata object
  // (Ensure that the property keys match what your API provides.)
  if (props.metadataProp && typeof props.metadataProp === 'object') {
    props.metadataProp.FromURL = `/test/updateForms`;
    props.metadataProp.redirectURL = `/test/updateForms/${props.slug}`;
    props.metadataProp.APIURL =
      `/api/${props.metadataProp.apiurLpostfix || ''}/${props.metadataProp.name || ''}`;
  }

  // For the form structure metadata used for designing/updating the form
  if (props.FormStructure_metadata && typeof props.FormStructure_metadata === 'object') {
    props.FormStructure_metadata.FromURL = `/test/updateForms`;
    props.FormStructure_metadata.redirectURL = `/test/updateForms/${props.slug}`;
    props.FormStructure_metadata.APIURL =
      `/api/${props.FormStructure_metadata.apiurLpostfix || ''}/${props.FormStructure_metadata.name || ''}`;
  }

  return (
      <div>
			<TagSEO metadataProp={{ title: "Update Form", description: "Update form metadata and fields.", keywords: "forms, update, test", robots: "noindex, nofollow", og: { title: "Update Form", description: "Update form metadata and fields." } }} canonicalSlug="test/updateForms/[slug]" />
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
        fieldsProp={Array.isArray(props.metadataProp?.forms_Fields) ? props.metadataProp.forms_Fields : []}
      />

	  <h2 className="text-lg font-bold mt-6">Here you may edit the metadata of the above form:</h2>
	  <DynaFormDB
              metadataProp={props.FormStructure_metadata}
              fieldsProp={Array.isArray(props.FormStructure_metadata?.forms_Fields) ? props.FormStructure_metadata.forms_Fields : []}
              formData={mapMetadataToEditorData(props.metadataProp)}
              displayHeaders={false}
            />

      <h2 className="text-lg font-bold mt-6">Here are the fields to be edited.</h2>
	  <ul>
        {/* Render each form field separately using the form structure */}
        {Array.isArray(props.metadataProp?.forms_Fields) && props.metadataProp.forms_Fields.map((field, index) => (
          <li key={field?.forms_FieldID || index} className="mb-4">
            <DynaFormDB
              metadataProp={props.FormStructure_field}
              fieldsProp={Array.isArray(props.FormStructure_field?.forms_Fields) ? props.FormStructure_field.forms_Fields : []}
              formData={mapFieldToEditorData(field)}
              displayHeaders={false}
            />
          </li>
        ))}
      </ul>
	  <ul>
        <div className="text-lg font-bold mt-6">Create a new form field:</div>
        {/* Set the requestType to "add" on the field structure form */}
        {props.FormStructure_field.requestType = "add"}
        <DynaFormDB
          metadataProp={props.FormStructure_field}
          fieldsProp={Array.isArray(props.FormStructure_field?.forms_Fields) ? props.FormStructure_field.forms_Fields : []}
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

  try {
    // Fetch metadata for the specified form slug.
    const metadataRes = await serverFetch(`/FormsMetadata/${slug}`);
    if (!metadataRes.ok) {
      console.error(`Failed to fetch metadata for slug "${slug}": ${metadataRes.status} ${metadataRes.statusText}`);
      throw new Error(`HTTP error! status: ${metadataRes.status}`);
    }
    const metadataArray = await metadataRes.json();
    // Extract the first element from the returned array.
    const metadata = Array.isArray(metadataArray) ? metadataArray[0] : metadataArray;
    console.log('MetadataProp from API:', metadata);

    // Fetch the metadata that defines the form structure.
    const formStructureRes = await serverFetch(`/FormsMetadata/UpdateFormsMeta`);
    if (!formStructureRes.ok) {
      console.error(`Failed to fetch form structure metadata: ${formStructureRes.status} ${formStructureRes.statusText}`);
      throw new Error(`HTTP error! status: ${formStructureRes.status}`);
    }
    const FormStructure_metadata = await formStructureRes.json();
    console.log('FormStructure_Metadata from API:', FormStructure_metadata);

	// Fetch the metadata that defines the form field structure.
	const FormStructure_fieldRes = await serverFetch(`/FormsMetadata/UpdateFormsFields`);
	if (!FormStructure_fieldRes.ok) {
	  console.error(`Failed to fetch form fields structure: ${FormStructure_fieldRes.status} ${FormStructure_fieldRes.statusText}`);
	  throw new Error(`HTTP error! status: ${FormStructure_fieldRes.status}`);
	}
	const FormStructure_field = await FormStructure_fieldRes.json();
	console.log('FormStructure_field from API:', FormStructure_field);

    // Fetch list of available form names.
    const formNamesRes = await serverFetch(`/FormsMetadata/listOfForms`);
    if (!formNamesRes.ok) {
      console.error(`Failed to fetch list of forms: ${formNamesRes.status} ${formNamesRes.statusText}`);
      throw new Error(`HTTP error! status: ${formNamesRes.status}`);
    }
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
      metadataProp: { forms_Fields: [] },
      FormStructure_metadata: { forms_Fields: [] },
	  FormStructure_field: { forms_Fields: [] },
      formNames: [],
      slug: slug,
      error: error?.message || 'Failed to load form data',
    };
  }
};
