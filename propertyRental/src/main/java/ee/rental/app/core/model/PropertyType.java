package ee.rental.app.core.model;

import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class,property="atpropertyTypeId")
public class PropertyType extends BaseLookup{
	public PropertyType(){}
	public PropertyType(Long id,String name,String description) {
		super();
		this.setId(id);
		this.setName(name);
		this.setDescription(description);
	}

}
